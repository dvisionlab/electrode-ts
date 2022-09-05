# Electrode

This library aims to read, parse and visualize DICOM files described in the A.34 section of [part3](https://dicom.nema.org/medical/dicom/current/output/chtml/part03/ps3.3.html) of the standard. 
At the moment it has been tested only on 12-Lead Electrocardiogram IOD (section A.34.3).

## Usage

```ts
import { readFile, createInstanceObjects, renderInstance } from "./index";
import { MultiplexGroup } from "./types";

const filePath = "test.dcm";

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
      // render the instance passing the target div id 
      renderInstance(div.id, instance as MultiplexGroup);
    });
  }
});
```

## Screeshot

![image](https://user-images.githubusercontent.com/45311591/188435466-e4488edc-aeab-42da-b172-dd8cfe39a3bd.png)


## Dev Setup

Download [Node.js](https://nodejs.org/en/download/).
Run these commands:

```bash
# Install dependencies (only the first time)
yarn install

# Run the local server at localhost:8080
yarn run dev

# Build for production in the dist/ directory
yarn run build
```
