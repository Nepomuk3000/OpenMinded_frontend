// tree-node.component.ts
import { Component, Input , Output, EventEmitter, OnInit} from '@angular/core';
import { TreeNode } from 'primeng/api';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss']
})
export class TreeNodeComponent implements OnInit {
  @Input() node: TreeNode = {};
  @Input() admin: boolean = false;
  @Output() selectedLabels = new EventEmitter<string[]>();

  cols: any[] = [];

  constructor(private userService : UserService){}

  ngOnInit(): void {

    this.cols = [
        { field: 'label', header: 'Title' },
        { field: 'data', header: 'Description' }
      ];
      if (this.admin)
      {
        this.cols.push(
          { field: 'actions', header: 'Actions' })
      }

  }

  hasGrandChildren(node: TreeNode): boolean {
    let ret:boolean = false
    if (node.children && node.children.length > 0) {
        if (node.children.every(child => child.children && child.children.length > 0)) {
            ret = true
        }
    }
    return ret
  }
  

  handleEditButtonClick(rowNode: any) {
    // Cette fonction sera appelée lorsque le bouton est cliqué.
    // Vous pouvez utiliser rowNode pour accéder aux données du nœud correspondant.
    console.log('Bouton d\'édition cliqué pour le nœud:', rowNode.node.label);
    
    // Vous pouvez également effectuer d'autres actions en fonction du nœud cliqué.
    // Par exemple, ouvrir une boîte de dialogue, déclencher une action, etc.
  }

  handleDeleteButtonClick(rowNode: any) {
    // Cette fonction sera appelée lorsque le bouton est cliqué.
    // Vous pouvez utiliser rowNode pour accéder aux données du nœud correspondant.
    console.log('Bouton de suppression cliqué pour le nœud:', rowNode.node.label);
    
    // Vous pouvez également effectuer d'autres actions en fonction du nœud cliqué.
    // Par exemple, ouvrir une boîte de dialogue, déclencher une action, etc.
  }

  onSelectionChange(event: any){
    const keys = event.map((objet : TreeNode) => objet.key);
    this.selectedLabels.emit(keys);
  }

  
  receiveData(data: string[]) {
    const outData = {parentNode:this.node.label,selectedKeys:data}
    this.selectedLabels.emit(data);
  }
}
