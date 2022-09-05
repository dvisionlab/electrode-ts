import { DataSet, Element } from "dicom-parser";

import {
  Waveform,
  MultiplexGroup,
  Channel,
  ChannelDefinition,
  ChannelSensitivityUnits
} from "./types";

/**
 * Utility function to read specific dicom tags
 * @param codeSequence
 * @returns
 */
function readCodeSequence(codeSequence: Element) {
  let code: Partial<ChannelSensitivityUnits> = {};
  if (codeSequence?.items && codeSequence?.items?.length > 0) {
    let codeDataset = codeSequence.items[0].dataSet!; // TODO remove "!"
    code.codeValue = codeDataset.string("x00080100");
    code.codingSchemeDesignator = codeDataset.string("x00080102");
    code.codingSchemeVersion = codeDataset.string("x00080103");
    code.codeMeaning = codeDataset.string("x00080104");
  }
  return code as ChannelSensitivityUnits;
}

/**
 * This function takes a dataset and produces the instances objects
 * @param dataSet
 * @returns
 */
export function createInstanceObjects(dataSet: DataSet) {
  let sopClassUID = dataSet.string("x00080016");

  switch (sopClassUID) {
    // 12-lead ECG Waveform Storage
    case "1.2.840.10008.5.1.4.1.1.9.1.1":
    // General ECG Waveform Storage
    case "1.2.840.10008.5.1.4.1.1.9.1.2":
    // Hemodynamic Waveform Storage
    case "1.2.840.10008.5.1.4.1.1.9.2.1":
      const channelSourceSequence = dataSet.elements["x003a0208"];
      if (channelSourceSequence) {
        console.debug(
          "Channel Source Sequence is present",
          channelSourceSequence
        );
      }

      // Structure: Waveform - Multiplex - Channel - Sample
      let waveform: Partial<Waveform> = {};
      const waveformSequence = dataSet.elements["x54000100"];
      if (waveformSequence?.items && waveformSequence?.items.length > 0) {
        console.debug("Waveform Sequence is present", waveformSequence);
        waveform.multiplexGroup = {};

        let mgs = waveformSequence.items.map(function (item) {
          if (item.tag == "xfffee000") {
            const multiplexGroup = item.dataSet!; // TODO avoid "!"
            let mg: Partial<MultiplexGroup> = {};

            mg.waveformOriginality = multiplexGroup.string("x003a0004");
            mg.numberOfWaveformChannels = multiplexGroup.uint16("x003a0005");
            mg.numberOfWaveformSamples = multiplexGroup.uint32("x003a0010");
            mg.samplingFrequency = multiplexGroup.floatString("x003a001a");
            mg.multiplexGroupLabel = multiplexGroup.string("x003a0020");

            // Initialization of channels
            mg.channels = [];

            const channelDefinitionSequence =
              multiplexGroup.elements["x003a0200"];

            if (channelDefinitionSequence !== undefined) {
              if (
                channelDefinitionSequence.items &&
                channelDefinitionSequence.items.length > 0
              ) {
                channelDefinitionSequence.items.forEach(function (
                  item,
                  channelIndex
                ) {
                  // Sequence Delimitation Item
                  if (item.tag == "xfffee000") {
                    const channelDefinition: DataSet = item.dataSet!; // TODO remove "!"
                    const cd: Partial<ChannelDefinition> = {};
                    // Channel Source
                    cd.channelSource = readCodeSequence(
                      channelDefinition.elements["x003a0208"]
                    );
                    // Channel Sensitivity
                    cd.channelSensitivity =
                      channelDefinition.string("x003a0210");
                    // Channel Sensitivity Units
                    cd.channelSensitivityUnits = readCodeSequence(
                      channelDefinition.elements["x003a0211"]
                    );
                    // Channel Sensitivity Correction Factor
                    cd.channelSensitivityCorrectionFactor =
                      channelDefinition.string("x003a0212");
                    // Channel Baseline
                    cd.channelBaseline = channelDefinition.string("x003a0213");
                    // Channel Time Skew
                    cd.channelTimeSkew = channelDefinition.string("x003a0214");
                    // Channel Sample Skew
                    cd.channelSampleSkew =
                      channelDefinition.string("x003a0215");
                    // Waveform Bits Stored
                    cd.waveformBitsStored =
                      channelDefinition.uint16("x003a021a");
                    // Filter Low Frequency
                    cd.filterLowFrequency =
                      channelDefinition.string("x003a0220");
                    // Filter High Frequency
                    cd.filterHighFrequency =
                      channelDefinition.string("x003a0221");

                    let channel: Partial<Channel> = {};
                    channel.channelDefinition = cd as ChannelDefinition;
                    channel.samples = [];

                    if (mg.channels) {
                      mg.channels[channelIndex] = channel as Channel;
                    }
                  }
                });
              }
            }

            mg.waveformBitsAllocated = multiplexGroup.uint16("x54001004");
            mg.waveformSampleInterpretation =
              multiplexGroup.string("x54001006");

            // TODO fix these
            let waveformPaddingValue: number | string = "";
            let waveformData: string = "";

            switch (mg.waveformBitsAllocated) {
              case 8:
                switch (mg.waveformSampleInterpretation) {
                  case "SB":
                  case "UB":
                  case "MB":
                  case "AB":
                  default:
                    waveformPaddingValue = multiplexGroup.string("x5400100a");
                    waveformData = multiplexGroup.string("x54001010");
                }
                break;

              case 16:
                switch (mg.waveformSampleInterpretation) {
                  case "SS":
                    waveformPaddingValue = multiplexGroup.int16("x5400100a");
                    waveformData = multiplexGroup.string("x54001010");
                    let sampleOffset =
                      multiplexGroup.elements["x54001010"].dataOffset;
                    let sampleSize =
                      mg.numberOfWaveformSamples * mg.numberOfWaveformChannels;
                    let sampleData = new Int16Array(
                      dataSet.byteArray.buffer,
                      sampleOffset,
                      sampleSize
                    );

                    mg.channels.forEach((channel, channelIndex) => {
                      // TODO remove "!"
                      let samples = new Array(mg.numberOfWaveformSamples).fill(
                        undefined
                      );
                      channel.samples = samples.map((_, sampleIndex) => {
                        return sampleData[
                          sampleIndex * mg.numberOfWaveformChannels! +
                            channelIndex
                        ];
                      });
                    });

                    console.debug("raw data", sampleData, mg.channels);

                    break;

                  case "US":
                    waveformPaddingValue = multiplexGroup.uint16("x5400100a");
                    waveformData = multiplexGroup.string("x54001010");
                    break;

                  default:
                    console.error("Cannot read data");
                }

                break;

              default:
                console.error("cannot read data");
            }

            mg.channels.map(channel => {
              let baseline = Number(channel.channelDefinition.channelBaseline);
              let sensitivity = Number(
                channel.channelDefinition.channelSensitivity
              );
              let sensitivityCorrectionFactor = Number(
                channel.channelDefinition.channelSensitivityCorrectionFactor
              );

              channel.samples.map(value => {
                return (
                  baseline + value * sensitivity * sensitivityCorrectionFactor
                );
              });
            });

            return mg;
          }
        });

        console.info("instances", mgs);

        return mgs;
      }

      break;

    default:
      console.log("Unsupported SOP Class UID: " + sopClassUID);
  }
}
