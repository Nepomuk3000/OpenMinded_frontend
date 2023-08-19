import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Observable , Observer, of } from 'rxjs';
import { UserService } from '../../services/user.service';
import { serverUrl } from '../../config';

import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-labels-list',
  templateUrl: './labels-tree.component.html',
  styleUrls: ['./labels-tree.component.scss']
})
 
export class LabelsTreeComponent implements OnInit {
  root: string = "";
  pRoot: TreeNode[] = [];
  cols: any[] = [];
  memorizedLabels = new Map();
  
  activeTabIndex = 0; // Index de l'onglet actif
  numberOfTabs = 0;

  
  constructor(private http: HttpClient,
              private renderer: Renderer2,
              private elementRef: ElementRef,
              public userService: UserService) {}
 
  async ngOnInit() {
    this.cols = [
      { field: 'title', header: 'Title' },
      { field: 'description', header: 'Description' }
  ];
  if (this.userService.isCurrentUserAdmin())
  {
    this.cols.push(
      { field: 'actions', header: 'Actions' })
  }


    await this.showLabels();
    console.log(this.cols)

  }


  convertToTreeNode(obj: any): TreeNode[] {
    const treeNodes: TreeNode[] = [];
    if (Array.isArray(obj))
    {
      obj.forEach((item: any) => {
        const treeNode: TreeNode = {
          label: item.title,
          data: {title:item.title,description:item.description},
          children: [],
          leaf:false
        };
    
        if (item.children && item.children.length > 0) {
          treeNode.children = this.convertToTreeNode(item.children);
        }    
        else
        {
          treeNode.leaf = true;
        }
        treeNodes.push(treeNode);
      });
    }
    return treeNodes;
  }
  
  async showLabels() {
    try {
      const response = await this.http.get<any>(serverUrl + '/api/label').toPromise();
      this.pRoot = this.convertToTreeNode(response.children); // Supposons que les nœuds sont dans une propriété "nodes"
      this.numberOfTabs = this.pRoot.length;
    } catch (error) {
      console.error('Une erreur s\'est produite :', error);
    }
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
  

  handlePreviousButtonClick(){
    this.activeTabIndex--;
    if (this.activeTabIndex < 0)
    {
      this.activeTabIndex = this.numberOfTabs - 1
    }
  }

  handleNextButtonClick(){
      this.activeTabIndex++;
      this.activeTabIndex%= this.numberOfTabs
  }


  onDeleteLabel(id: string) {
    if (confirm('Voulez-vous vraiment supprimer le label "' + this.memorizedLabels.get(id).title + '" ?')) {   
      const observer: Observer<any> = {
        next: (response) => {
          console.log(response['message']);
          this.showLabels();
        },
        error: (error) => {
          alert(error['error']['error']['message']);
        },
        complete: () => {
          console.log('Delete request complete');
        }
      };

      this.http.delete<any>(serverUrl + '/api/label/'+ id).subscribe(observer);
    }
  }
  
  onUpdateLabel(element :any) {

    const observer: Observer<any> = {
      next: (response) => {
        console.log(response['message']);
        this.showLabels();
      },
      error: (error) => {
        alert(error['error']['error']['message']);
      },
      complete: () => {
        console.log('Update request complete');
      }
    };

    let body :string= '{"title":"'+element.title+'","description":"'+element.description+'","category":"'+element.category+'","subcategory":"'+element.subcategory+'"}';
    this.http.put<any>(serverUrl + '/api/label/' + element._id,body, { headers: { 'Content-Type': 'application/json' } }).subscribe(observer);
  }
  
  onUpdateName(id: string, newTitle: HTMLInputElement) {
    if (this.memorizedLabels.get(id)['title'] != newTitle.value)
    {
      this.renderer.setStyle(newTitle, 'background-color', 'red');
      this.memorizedLabels.get(id)['needUpdate']=true;
    }
    else
    {
      this.renderer.setStyle(newTitle, 'background-color', 'white');
      this.memorizedLabels.get(id)['needUpdate']=false;
    }
  }
  
  onUpdateCategory(id: string, newCategory: HTMLInputElement) {
    if (this.memorizedLabels.get(id)['category'] != newCategory.value)
    {
      this.renderer.setStyle(newCategory, 'background-color', 'red');
      this.memorizedLabels.get(id)['needUpdate']=true;
    }
    else
    {
      this.renderer.setStyle(newCategory, 'background-color', 'white');
      this.memorizedLabels.get(id)['needUpdate']=false;
    }
  }
  
  onUpdateSubcategory(id: string, newSubcategory: HTMLInputElement) {
    if (this.memorizedLabels.get(id)['subcategory'] != newSubcategory.value)
    {
      this.renderer.setStyle(newSubcategory, 'background-color', 'red');
      this.memorizedLabels.get(id)['needUpdate']=true;
    }
    else
    {
      this.renderer.setStyle(newSubcategory, 'background-color', 'white');
      this.memorizedLabels.get(id)['needUpdate']=false;
    }
  }
  
  onUpdateDescription(id: string, newDescription: HTMLTextAreaElement) {
    if (this.memorizedLabels.get(id)['description'] != newDescription.value) {
      this.renderer.setStyle(newDescription, 'background-color', 'red');
      this.memorizedLabels.get(id)['needUpdate']=true;
    }
    else {
      this.renderer.setStyle(newDescription, 'background-color', 'white');
      this.memorizedLabels.get(id)['needUpdate']=false;
    }
  }

  checkNeedUpdate() {
    let ret : boolean = false
    /*
    this.labels.forEach(label => {
      if(label['needUpdate']==true){
        ret=true;
      }
    });*/
    return ret;
  }

  onAddLabel(category: HTMLInputElement, subcategory:HTMLInputElement) {
    if (this.checkNeedUpdate()) {
      alert("Un champs doit être mis à jour avant d'ajouter un nouveau label")
    }
    else {

      const observer: Observer<any> = {
        next: (response) => {
          this.showLabels();
          console.log(response['message']);
        },
        error: (error) => {
          alert(error['error']['error']['message']);
        },
        complete: () => {
          console.log('Post request complete');
        }
      };

      let body :string= '{"title":"New title","category":"' + category.value + '","subcategory":"' + subcategory.value + '"}';
      this.http.post<any>(serverUrl + '/api/label/',body, { headers: { 'Content-Type': 'application/json' } }).subscribe(observer);
    }
  }

  test(element :any)
  {
    console.log(element);
  }
}
