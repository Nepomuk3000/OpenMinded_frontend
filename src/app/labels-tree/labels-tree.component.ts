import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Observable , Observer, of } from 'rxjs';
import { UserService } from '../../services/user.service';
import { serverUrl } from '../../config';

import { TreeNode } from 'primeng/api';
import { Tree } from 'primeng/tree';

export interface SelectedLabels {
  source:TreeNode,
  selectedIds:string[]
}
@Component({
  selector: 'app-labels-list',
  templateUrl: './labels-tree.component.html',
  styleUrls: ['./labels-tree.component.scss']
})
 
export class LabelsTreeComponent implements OnInit {
  @Input() admin:boolean = false
  @Output() selectedLabelsEvt = new EventEmitter<string[]>();
  @Input() inSelectedLabel : string[] = []
  selectedLabelsIds : { [key: string]: string[] } = {};
  root: string = "";
  pRoot: TreeNode = {};
  categories: TreeNode[] = []
  subCategories :{ [key: string]: TreeNode[] } = {};
  cols: any[] = [];
  memorizedLabels = new Map();
  
  activeTabIndex = 0; // Index de l'onglet actif
  numberOfTabs = 0;

  
  constructor(private http: HttpClient,
              private renderer: Renderer2,
              private elementRef: ElementRef,
              public userService: UserService) {}
 
  async ngOnInit() {

    console.log("inSelectedLabel = ",this.inSelectedLabel)
    await this.showLabels();
  }

  receiveData(selectedLabels:SelectedLabels) {
    console.log("toto1",selectedLabels.source,selectedLabels.selectedIds)
    const key:string = selectedLabels.source.label?selectedLabels.source.label:""
    this.selectedLabelsIds[key]= selectedLabels.selectedIds
    console.log("toto2",this.selectedLabelsIds)
    // Créez un tableau résultant (string[]) pour stocker tous les éléments
    const resultArray: string[] = [];

    // Parcourez le dictionnaire et ajoutez chaque élément au tableau résultant
    for (const key in this.selectedLabelsIds) {
      if (this.selectedLabelsIds.hasOwnProperty(key)) {
        const arrayForCurrentKey = this.selectedLabelsIds[key];
        resultArray.push(...arrayForCurrentKey);
      }
    }
    console.log("toto3",resultArray)
    this.selectedLabelsEvt.emit(resultArray);

  }

  convertToTreeNode(inNode:any, nodeList: any): TreeNode {
    let outNode : TreeNode = {}
    if (inNode) {
     outNode = {
        key:inNode._id,
        label:inNode.title,
        data:inNode.description,
        children:[]}
      inNode.children.forEach((child:any) => {
        const elementRecherche = nodeList.find((item:any) => item._id === child);
        let childTreeNode = this.convertToTreeNode(elementRecherche, nodeList)
        if(outNode.children)
          outNode.children.push(childTreeNode)
      }); 
    }
    
    return outNode;
  }
  
  async showLabels() {
    try {
      const response = await this.http.get<any>(serverUrl + '/api/label').toPromise();
      response.forEach((node:any) => {
        if(node.title == 'root') {
          this.pRoot = this.convertToTreeNode(node,response); // Supposons que les nœuds sont dans une propriété "nodes"
        }
      });
      if (this.pRoot.children) {
        this.numberOfTabs = this.pRoot.children.length;
        this.categories = this.pRoot.children
        this.categories.forEach(category => {
          if (category.children && category.label) {
              this.subCategories[category.label] = category.children
          }
        });
      }
    } catch (error) {
      console.error('Une erreur s\'est produite :', error);
    }
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
