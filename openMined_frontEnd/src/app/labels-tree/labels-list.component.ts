import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-labels-list',
  templateUrl: './labels-list.component.html',
  styleUrls: ['./labels-list.component.scss']
})

export class LabelsListComponent implements OnInit {
  labels: any[] = [];
  memorizedLabels = new Map();
  colonnesTableau: string[] = [ 'title','category','subcategory', 'description','actions'];
  constructor(private http: HttpClient,private renderer: Renderer2,private elementRef: ElementRef) {}
  //constructor(private renderer: Renderer2) {}
 
  ngOnInit() {
    this.showLabels();
  }


  showLabels(){
    this.http.get<any>('http://192.168.1.111:3000/api/label').subscribe(data => {
      this.labels = data;

      this.labels.forEach(label => {
        this.memorizedLabels.set(label._id,label);
      });

    });
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

      this.http.delete<any>('http://192.168.1.111:3000/api/label/'+id).subscribe(observer);
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
    this.http.put<any>('http://192.168.1.111:3000/api/label/' + element._id,body, { headers: { 'Content-Type': 'application/json' } }).subscribe(observer);
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
    let ret : boolean = false;
    this.labels.forEach(label => {
      if(label['needUpdate']==true){
        ret=true;
      }
    });
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
      this.http.post<any>('http://192.168.1.111:3000/api/label/',body, { headers: { 'Content-Type': 'application/json' } }).subscribe(observer);
    }
  }

  test(element :any)
  {
    console.log(element);
  }
}
