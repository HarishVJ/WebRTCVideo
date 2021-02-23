import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import "./index.scss";
import debounce from "lodash/debounce";
declare var $;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements AfterViewInit {



  constructor(
    private elementRef: ElementRef
  ) { }

  @ViewChild('gallery', { static: true }) gallery: ElementRef;


  title = 'riverwayVideo';

  ngOnInit() {


  }

  ngAfterViewInit() {

    // console.log(this.gallery);
    // this.gallery.nativeElement.innerHTML = "Hello Angular 10!";
    const debouncedRecalculateLayout = debounce(this.recalculateLayout, 50);
    window.addEventListener("resize", debouncedRecalculateLayout);
    debouncedRecalculateLayout();

  }




  recalculateLayout() {
    const gallery = document.getElementById("gallery");
    const aspectRatio = 16 / 9;
    const screenWidth = document.body.getBoundingClientRect().width;
    const screenHeight = document.body.getBoundingClientRect().height;
    const videoCount = document.getElementsByTagName("video").length;

    // or use this nice lib: https://github.com/fzembow/rect-scaler


    let layout = calculateLayout(
      screenWidth,
      screenHeight,
      videoCount,
      aspectRatio
    );

    // $(".video-container").attr("width", layout.width + "px");
    // $(".video-container").attr("height", layout.height + "px");
    // $(".video-container").attr("cols", layout.cols + "px");
    this.gallery["style"].setProperty("--width", layout.width + "px");
    this.gallery["style"].setProperty("--height", layout.height + "px");
    this.gallery["style"].setProperty("--cols", layout.cols + "");
  }

  deleteFrame(index) {

    // debugger;
    $('#video' + index).remove();
    this.ngAfterViewInit();

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
    const area = width * height;
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
