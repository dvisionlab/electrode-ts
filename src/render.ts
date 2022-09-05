import Plotly from "plotly.js-basic-dist";
import { Channel, Axis, MultiplexGroup } from "./types";

/**
 * This function takes a multiplex group object and render the corresponding charts into the target element
 * @param targetElementId
 * @param mg
 */
export function renderInstance(targetElementId: string, mg: MultiplexGroup) {
  for (
    var numChannel = 0;
    numChannel < mg.numberOfWaveformChannels;
    numChannel++
  ) {
    let chartId = ["chart", targetElementId, numChannel].join("_");
    var yAxis: Partial<Axis> = {};

    addDiv(targetElementId, chartId);

    switch (
      mg.channels[numChannel].channelDefinition.channelSensitivityUnits
        .codeValue
    ) {
      case "uV":
        yAxis.min = -500;
        yAxis.max = 1500;
        yAxis.deltaMain = 500;
        yAxis.deltaSecondary = 100;
        break;

      case "mV":
        yAxis.min = -0.5;
        yAxis.max = 1.5;
        yAxis.deltaMain = 0.5;
        yAxis.deltaSecondary = 0.1;
        break;

      case "mm[Hg]":
        yAxis.min = 0;
        yAxis.max = 200;
        yAxis.deltaMain = 100;
        yAxis.deltaSecondary = 20;
        break;

      default:
        yAxis.min = -500;
        yAxis.max = 1500;
        yAxis.deltaMain = 500;
        yAxis.deltaSecondary = 100;
    }

    yAxis.label =
      mg.channels[numChannel].channelDefinition.channelSensitivityUnits
        .codeMeaning +
      " (" +
      mg.channels[numChannel].channelDefinition.channelSensitivityUnits
        .codeValue +
      ")";

    createChart(chartId, mg.channels[numChannel], yAxis as Axis);
  }
}

/**
 * Utility function to add a div
 * @param parentId
 * @param divId
 */
function addDiv(parentId: string, divId: string) {
  const div = document.createElement("div");
  div.id = divId;
  document.getElementById(parentId)?.appendChild(div);
}

/**
 * This is the core function for chart creation with Plotly.js
 * @param chartId
 * @param channelData
 * @param yAxis
 */
function createChart(chartId: string, channelData: Channel, yAxis: Axis) {
  const codeMeaning = channelData.channelDefinition.channelSource.codeMeaning;
  const xMin = 0;
  const xMax = channelData.samples.length;
  const dxMain = 200;
  const dxSec = 40;
  const yMax = yAxis.max;
  const ymin = yAxis.min;
  const dyMain = yAxis.deltaMain;
  const dySec = yAxis.deltaSecondary;
  const yLabel = yAxis.label;

  const trace: Partial<Plotly.PlotData> = {
    x: channelData.samples.map((s, i) => i),
    y: channelData.samples,
    mode: "lines",
    type: "scattergl", // enable webgl rendering
    line: {
      // color: "rgb(128, 0, 128)",
      width: 1.5,
      shape: "linear" // interpolation
    }
  };

  var data = [trace];

  var layout = {
    title: codeMeaning,
    xaxis: {
      // title: "ms",
      showgrid: true,
      // gridcolor: "#ee8833",
      gridcolor: "rgba(238,135,51,0.5)",
      zeroline: false,
      showline: true,
      // main ticks
      autotick: false,
      showticklabels: false,
      // ticks: "outside",
      tick0: 0,
      dtick: dxMain,
      ticklen: 10,
      tickwidth: 2,
      tickcolor: "#000",
      // minor
      minor: {
        showgrid: true,
        gridcolor: "rgba(238,135,51,0.5)",
        tick0: 0,
        dtick: dxSec,
        ticklen: 5,
        tickwidth: 0.5,
        tickcolor: "#000"
      }
    },
    yaxis: {
      title: yLabel,
      showticklabels: true,
      showgrid: true,
      gridcolor: "rgba(238,135,51,0.5)",
      zeroline: true,
      showline: true,
      // minor
      minor: {
        showgrid: true,
        gridcolor: "rgba(238,135,51,0.5)",
        dtick: dySec,
        ticklen: 5,
        tickwidth: 0.5,
        tickcolor: "#000"
      }
    }
  };

  Plotly.newPlot(chartId, data, layout, { responsive: true });
}
