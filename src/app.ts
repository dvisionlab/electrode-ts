import { readFile, createInstanceObjects, renderInstance } from "./index";
import { MultiplexGroup } from "./types";

// const filePath = "test_ecg.dcm";
const filePath = "prova.dcm";

// read dicom file
readFile(filePath).then(dataset => {
  // create instance object
  let instances = createInstanceObjects(dataset);
  // get target div
  let containerDiv = document.getElementById("main-content")!;

  if (instances !== undefined) {
    // create a div for each instance
    let cols = instances.length < 12 ? Math.floor(12 / instances.length) : "";
    instances.forEach((instance, i) => {
      const div = document.createElement("div");
      div.id = `div_${i}`;
      div.classList.add(`col-${cols}`);
      containerDiv.appendChild(div);
      // render the instance
      renderInstance(div.id, instance as MultiplexGroup);
    });
  }
});
