import { Component, Input, OnInit, SimpleChanges, ElementRef, Renderer2, Output, EventEmitter, NgModule   } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from 'src/services/user.service';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

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
  @Output() previousUser: EventEmitter<any> = new EventEmitter();
  showMore:boolean=false;
  hasAMouse:boolean=false;

  editableOrNot(): string {
    return this.isEditable ? 'editable' : 'notEditable';
  }

  constructor(private userService:UserService, private elementRef:ElementRef, private renderer:Renderer2){}

  ngOnInit() {
    this.hasAMouse = !('ontouchstart' in window) || navigator.maxTouchPoints === 0;
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
        this.processImages();
      });
    }
  }

  processImages() {
    let lImagesList = [];
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


  onSave(form: NgForm) {
    // Vérifiez si le formulaire est valide avant de traiter les modifications
    if (form.valid) {
      this.userService.updateUser(this.user,form.value);
      // Vous pouvez effectuer d'autres opérations avec les valeurs modifiées, comme les sauvegarder dans votre modèle de données, les envoyer au serveur, etc.
    }
  }

  handleRightButtonClick()
  {
    this.nextUser.emit();
  }

  handleLeftButtonClick()
  {
    this.previousUser.emit();
  }

  handleDownButtonClick()
  {
    this.showMore=!this.showMore;
  }

  handleRejectUser()
  {
    console.log("TODO : Implémenter le rejet d'un utilisateur")
  }
}