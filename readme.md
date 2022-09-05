# Electrode

This library aims to read, parse and visualize DICOM files described in the A.34 section of [part3](https://dicom.nema.org/medical/dicom/current/output/chtml/part03/ps3.3.html) of the standard.
At the moment it has been tested only on 12-Lead Electrocardiogram IOD (section A.34.3).

## Dev Setup

Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

```bash
# Install dependencies (only the first time)
yarn install

# Run the local server at localhost:8080
yarn run dev

# Build for production in the dist/ directory
yarn run build
```

## Roadmap

[x] Plotly rendering  
[x] Responsive layout  
[x] Tools (zoom, pan, ...)  
[x] Finalize visualization (axis, grid)  
[-] Reworking  
[ ] Test with different dicom datasets  
[ ] Check Axis min/max and units  
[ ] Test Performance with more points
