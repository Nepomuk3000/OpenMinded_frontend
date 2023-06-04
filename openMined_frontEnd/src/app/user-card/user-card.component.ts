import { Component, Input, OnInit, SimpleChanges, ElementRef, Renderer2, Output, EventEmitter   } from '@angular/core';
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
  image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBOSsYZjqFUzfY_UyBns1ST83GHjYC1ozprw&usqp=CAU";
  prevCptImage=0;
  cptImage=0;
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
    this.imagesList = [];
    this.imagesList.push(this.user.image);
    if (this.user.albums)
    {
      this.user.albums.forEach(album => {
        album.images.forEach(image =>{
          this.imagesList.push(image);
        });
      });
    }
    this.updateImage();
  }


  onSave(form: NgForm) {
    // Vérifiez si le formulaire est valide avant de traiter les modifications
    if (form.valid) {
      this.userService.updateUser(this.user,form.value);
      // Vous pouvez effectuer d'autres opérations avec les valeurs modifiées, comme les sauvegarder dans votre modèle de données, les envoyer au serveur, etc.
    }
  }

  handleImageClick(event: MouseEvent) {
    const imageElement = event.target as HTMLImageElement;
    const imageWidth = imageElement.offsetWidth;
    const clickX = event.clientX - imageElement.getBoundingClientRect().left;

    // Vérifier si le clic a eu lieu dans la partie droite de l'image
    if (clickX > imageWidth / 2) {
      this.cptImage = this.cptImage+1;
    } else {
      this.cptImage = this.cptImage-1;
    }
    this.updateImage();
  }

  updateImage()
  {
    if (this.cptImage < 0)
    {
      this.cptImage=this.imagesList.length - 1;
    }
    if (this.cptImage >= this.imagesList.length)
    {
      this.cptImage = 0;
    }

    this.image = this.imagesList[this.cptImage];
    try {
      
      let element = this.elementRef.nativeElement.querySelector('.imageMark-' + this.prevCptImage);
      this.renderer.removeClass(element, 'imageMarkerUp');
      this.renderer.addClass(element, 'imageMarkerDown');
      
      element = this.elementRef.nativeElement.querySelector('.imageMark-' + this.cptImage);
      this.renderer.removeClass(element, 'imageMarkerDown');
      this.renderer.addClass(element, 'imageMarkerUp');
    } catch (error) {
    }

    this.prevCptImage = this.cptImage;
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