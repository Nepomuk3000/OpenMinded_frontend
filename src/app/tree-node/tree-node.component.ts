// tree-node.component.ts
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss']
})
export class TreeNodeComponent {
  @Input() node: any;
  folded = false;

  ngOnInit() {
    console.log("What the hell : " + this.node);
  }

  toggleFoldable() {
    this.folded = !this.folded;
  }
}
