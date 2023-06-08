import { Component, Input, OnInit, SimpleChanges, Output, EventEmitter  } from '@angular/core';

@Component({
  selector: 'app-image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.scss']
})
export class ImageCardComponent implements OnInit {
  image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBOSsYZjqFUzfY_UyBns1ST83GHjYC1ozprw&usqp=CAU";
  cptImage=0;
  @Output() cptImageChange = new EventEmitter<number>();
  @Input() imagesList:string[] = [];
  prevCptImage=0;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['imagesList']) {
      // La valeur de l'@Input a changé, réagissez en conséquence
      this.updateImage();
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
    this.cptImageChange.emit(this.cptImage);
  }

}
