import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-dishdetail",
  templateUrl: "./dishdetail.component.html",
  styleUrls: ["./dishdetail.component.scss"],
})
export class DishdetailComponent implements OnInit {
  @Input() dish;

  constructor() {}

  ngOnInit() {}
}
