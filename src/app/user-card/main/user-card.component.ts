import { Component, Input, OnInit, SimpleChanges, ElementRef, Renderer2, Output, EventEmitter   } from '@angular/core';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})

export class UserCardComponent implements OnInit {
  @Input() user: User = new User();
  @Input() userId: string = "";
  @Input() isEditable:boolean=false;
  @Input() hideNextPrecButtons:boolean=false;
  panelOpenState = false;
  prevCptImage=0;
  imagesList:string[] = [];
  @Output() nextUser: EventEmitter<any> = new EventEmitter();
  @Output() navigateToUser: EventEmitter<any> = new EventEmitter();
  @Output() rejectUser: EventEmitter<any> = new EventEmitter<User>();
  showMore:boolean=false;
  hasAMouse:boolean=false;

  constructor(private userService:UserService, 
    private elementRef:ElementRef, 
    private renderer:Renderer2,
    private router: Router,
    private messageService:MessageService) {}

  ngOnInit() {
    this.hasAMouse = !('ontouchstart' in window) || navigator.maxTouchPoints === 0;
    if (this.isEditable)
    {
      this.showMore = true;
    }
    this.processImages();
  }

  receiveData(data: string[]) {
    console.log("toto4",data)
    this.user.labels = data
  }

  handleCptImageChange(cptImage: number)
  {
    try {
      
      let element = this.elementRef.nativeElement.querySelector('.imageMark-' + this.prevCptImage);
      this.renderer.removeClass(element, 'imageMarkerUp');
      this.renderer.addClass(element, 'imageMarkerDown');
      
      element = this.elementRef.nativeElement.querySelector('.imageMark-' + cptImage);
      this.renderer.removeClass(element, 'imageMarkerDown');
      this.renderer.addClass(element, 'imageMarkerUp');
    } catch (error) {
    }

    this.prevCptImage = cptImage;
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['user']) {
      this.user = changes['user'].currentValue;
      this.userId = String(this.user._id);
      this.processImages();
    } else if (changes['userId']) {
      this.userId = changes['userId'].currentValue;

      this.userService.getUser(this.userId).subscribe((user: User) => {
        this.user = user;
        this.user.password = ''
        this.processImages();
      });
    }
  }

  processImages() {
    let lImagesList : string[] = [];
    console.log(this.user.image)
    lImagesList.push(this.user.image);
    if (this.user.albums)
    {
      this.user.albums.forEach(album => {
        album.images.forEach(image =>{
          lImagesList.push(image);
        });
      });
    }
    this.imagesList = lImagesList;
 }

  async onSave(form: NgForm) {
    // Vérifiez si le formulaire est valide avant de traiter les modifications
    if (form.valid) {
      console.log(form)
      const response = await this.userService.updateUser(this.user);
      console.log(response)
      if (response.status == 200) 
      {
          this.messageService.add(
            { severity: 'success', 
              summary: 'Update user', 
              detail: "User updated successfully" });
      } else {
        // Gérer d'autres types de retour (si nécessaire)
        console.error('Une erreur s\'est produite :', response);
        this.messageService.add(
          { severity: 'error', 
            summary: 'Update user', 
            detail: "response.message" });
      }

    }
  }

  handleNextButtonClick()
  {
    this.nextUser.emit();
  }

  handlePreviousButtonClick()
  {
  }

  handleDetailsButtonClick(userId: string)
  {
    this.router.navigate(['/random'], { queryParams: { userId } });
  }

  handleShowMoreButtonClick()
  {
    this.showMore=!this.showMore;
  }
}