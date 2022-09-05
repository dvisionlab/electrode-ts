import dicomParser from "dicom-parser";
import { DataSet } from "dicom-parser";

/**
 * Read and parse the dicom file
 * @param filePath
 * @returns
 */
export function readFile(filePath: string): Promise<DataSet> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("get", filePath, true);
    request.responseType = "arraybuffer";
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status == 200) {
          const byteArray = new Uint8Array(request.response);
          const dataSet = dicomParser.parseDicom(byteArray);
          resolve(dataSet);
        } else {
          reject("Error reading file");
        }
      }
    };
    request.send();
  });
}
