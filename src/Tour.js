import Shepherd from "shepherd.js";

const tour = new Shepherd.Tour({
  defaultStepOptions: {
    classes: "shadow-md bg-purple-dark",
    scrollTo: true,
  },
});

tour.addStep({
  id: "example-step",
  text: "Search for a particular code",
  attachTo: {
    element: "button .MuiToolbar-root",
    on: "left",
  },
  classes: "example-step-extra-class",
  buttons: [
    {
      text: "Next",
      action: tour.next,
    },
  ],
});

export default tour;
