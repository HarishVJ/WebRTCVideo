import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import "./index.scss";
import debounce from "lodash/debounce";
declare var $;

const currentObj = this;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements AfterViewInit {
  @ViewChild('divContainer', { static: true }) gallery: ElementRef;

  private videoCount: number = 9;
  private videoAlignCount: number = 9;
  private containerName: string = "";
  private screenWidth: number = 0;
  private screenHeight: number = 0;
  constructor(
    private elementRef: ElementRef
  ) {



  }
  title = 'riverwayVideo';

  ngOnInit() {
    this.screenWidth = document.body.getBoundingClientRect().width;
    this.screenHeight = document.body.getBoundingClientRect().height;
    let videoCnt = this.videoCount > this.videoAlignCount ? this.videoAlignCount : this.videoCount;

    document.getElementById("temp").innerHTML = "divContainer1" + "," + videoCnt + "," + this.screenWidth + "," + this.screenHeight;
    this.addVideoControls(this.videoCount);
  }

  ngAfterViewInit() {

    this.calculateConstraint();

  }

  private calculateConstraint() {
    const debouncedRecalculateLayout = debounce(this.recalculateLayout, 50);
    window.addEventListener("resize", debouncedRecalculateLayout);
    debouncedRecalculateLayout();
  }


  private recalculateLayout() {

    let tempvalue = document.getElementById("temp").innerHTML;
    let containerName = tempvalue.split(',')[0];
    let videoCount = parseInt(tempvalue.split(',')[1]);
    let gallery = document.getElementById(containerName);
    let aspectRatio = 16 / 9;
    // document.getElementById("divContainer1").getBoundingClientRect().width = document.body.getBoundingClientRect().width;
    // document.getElementById("divContainer1").getBoundingClientRect().height = document.body.getBoundingClientRect().height;
    let screenWidth = parseFloat(tempvalue.split(',')[2]);
    let screenHeight = parseFloat(tempvalue.split(',')[3]);

    // or use this nice lib: https://github.com/fzembow/rect-scaler


    let layout = calculateLayout(
      screenWidth,
      screenHeight,
      videoCount,
      aspectRatio
    );

    gallery["style"].setProperty("--width", layout.width + "px");
    gallery["style"].setProperty("--height", layout.height + "px");
    gallery["style"].setProperty("--cols", layout.cols + "");
  }


  private addVideoControls(videoCount) {

    try {
      const gallery = document.getElementById("divVideoContainer");
      let containerIndex = 0;
      let isReadytoAppend: boolean = false;
      let container: any;
      let sliderRight: any;
      let sliderLeft: any;
      for (let index = 0; index < videoCount; index++) {

        // Creating video element 
        var vidElement = document.createElement('video');
        // vidElement.setAttribute('autoplay', '');
        vidElement.setAttribute('muted', "true");
        vidElement.src = "../assets/rr.mp4";

        //Creating video container div

        var vidContainer = document.createElement('div');
        vidContainer.setAttribute('id', 'video' + index);
        vidContainer.setAttribute('class', 'video-container');
        vidContainer.appendChild(vidElement);
        vidContainer.appendChild(this.makeLabel("user" + index));
        let currentObect = this;
        vidContainer.addEventListener("click", function () {
          currentObect.deleteFrame(index)
        });

        if (index == 0 || (index >= this.videoAlignCount && index % this.videoAlignCount === 0)) {
          containerIndex = containerIndex + 1
          isReadytoAppend = true;
          container = document.createElement('div');
          container.setAttribute('id', 'divContainer' + containerIndex);
          container.setAttribute('class', 'container');
          sliderRight = document.createElement('div');
          sliderRight.setAttribute('id', 'sliderRight' + containerIndex);
          sliderRight.setAttribute('class', 'divsliderRight');
          // sliderRight.html('>');
          sliderRight.addEventListener("click", function () {
            currentObect.toggleContainer(containerIndex, videoCount)
          });

          sliderLeft = document.createElement('div');
          sliderLeft.setAttribute('id', 'sliderLeft' + containerIndex);
          sliderLeft.setAttribute('class', 'divsliderLeft');
          sliderLeft.addEventListener("click", function () {
            currentObect.toggleContainer(containerIndex -1, videoCount)
          });
          if (index != 0) {
            container["style"].setProperty("display", "none");
            sliderRight["style"].setProperty("display", "none");
            sliderLeft["style"].setProperty("display", "none");

          }
        }
        container.appendChild(vidContainer);

        if (isReadytoAppend) {
          gallery.appendChild(container);
          gallery.appendChild(sliderRight);
          gallery.appendChild(sliderLeft);
        }



      }


    } catch (error) {
      console.log(error)
    }
  }
  toggleContainer(containerIndex: number, videoCount: any) {

    let getContainerCount = Math.ceil(videoCount / this.videoAlignCount);
    for (let index = 1; index <= containerIndex; index++) {

      if (index != containerIndex)
        document.getElementById("divContainer" + index)["style"].setProperty("display", "none");
      // $('#divContainer' + index).remove();
    }
    // document.getElementById("divContainer" + containerIndex)["style"].setProperty("display", "block");
    document.getElementById("divContainer" + containerIndex)["style"].setProperty("display", "flex");
    document.getElementById("temp").innerHTML = "divContainer" + containerIndex + "," + (this.videoCount - this.videoAlignCount) + "," + this.screenWidth + "," + this.screenHeight;
    this.calculateConstraint();



  }

  private deleteFrame(index) {

    // debugger;
    $('#video' + index).remove();
    this.ngAfterViewInit();

  }


  private makeLabel(label) {
    var vidLabel = document.createElement('div');
    vidLabel.appendChild(document.createTextNode(label));
    vidLabel.setAttribute('class', 'videoLabel');
    return vidLabel;
  }






}

function calculateLayout(
  containerWidth: number,
  containerHeight: number,
  videoCount: number,
  aspectRatio: number
): { width: number; height: number; cols: number } {
  let bestLayout = {
    area: 0,
    cols: 0,
    rows: 0,
    width: 0,
    height: 0
  };

  // brute-force search layout where video occupy the largest area of the container
  for (let cols = 1; cols <= videoCount; cols++) {
    const rows = Math.ceil(videoCount / cols);
    const hScale = containerWidth / (cols * aspectRatio);
    const vScale = containerHeight / rows;
    let width;
    let height;
    if (hScale <= vScale) {
      width = Math.floor(containerWidth / cols);
      height = Math.floor(width / aspectRatio);
    } else {
      height = Math.floor(containerHeight / rows);
      width = Math.floor(height * aspectRatio);
    }
    let area = width * height;
    if (area > bestLayout.area) {
      bestLayout = {
        area,
        width,
        height,
        rows,
        cols
      };
    }
  }
  return bestLayout;
}
