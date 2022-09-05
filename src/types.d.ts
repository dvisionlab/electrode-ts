type Waveform = {
  multiplexGroup: Object;
};

type MultiplexGroup = {
  waveformOriginality: string;
  numberOfWaveformChannels: number;
  numberOfWaveformSamples: number;
  samplingFrequency: number;
  multiplexGroupLabel: string;
  channels: Array<Channel>;
  waveformBitsAllocated: number;
  waveformSampleInterpretation: string;
};

type Channel = {
  channelDefinition: ChannelDefinition;
  samples: Array<any>;
};

type ChannelSensitivityUnits = {
  codeValue: string;
  codeMeaning: string;
  codingSchemeDesignator: string;
  codingSchemeVersion: string;
};

type ChannelDefinition = {
  channelSource: {
    codeMeaning: string;
  };
  channelSensitivity: string;
  channelSensitivityUnits: ChannelSensitivityUnits;
  channelSensitivityCorrectionFactor: string;
  channelBaseline: string;
  channelTimeSkew: string;
  channelSampleSkew: string;
  waveformBitsStored: number;
  filterLowFrequency: string;
  filterHighFrequency: string;
};

type Axis = {
  min: number;
  max: number;
  deltaMain: number;
  deltaSecondary: number;
  label: string;
};

export {
  Waveform,
  MultiplexGroup,
  Channel,
  ChannelDefinition,
  ChannelSensitivityUnits,
  Axis
};
