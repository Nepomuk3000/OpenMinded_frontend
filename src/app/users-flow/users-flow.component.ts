import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Component, OnInit, HostListener, ElementRef, Renderer2  } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
import { Location } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-users-flow',
  templateUrl: './users-flow.component.html',
  styleUrls: ['./users-flow.component.scss']
})

export class UsersFlowComponent implements OnInit {
  
  userId: string = "";
  curUserId: string = "";
  paramsUsed: boolean = false;
  searchRadius: number = 0; // Valeur initiale, vous pouvez la modifier en fonction de vos besoins
  
  constructor(private userService: UserService , 
    private elementRef: ElementRef, 
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location) {}

    ngOnInit() {
      this.route.snapshot.queryParams = {};
      this.curUserId = this.userService.getCurrentUserId() || "";
  
      if (this.curUserId) {
        this.userService.getUser(this.curUserId).subscribe((user: User) => {
          this.searchRadius = user.requirements.searchRadius;
        });
      } else {
        // Traitez le cas où curUserId est null, par exemple, affichez un message d'erreur ou redirigez l'utilisateur vers une page de connexion.
      }

      this.loadUsers();
      this.onResize();
    }

  navigateToUser(userId:string)
  {
    console.log("Oui c'est de la que ça part  : " + userId)
  }

  setSearchRadius() {
    this.userService.setSearchRadius(this.searchRadius)
    this.loadUsers()
  }

  async resetVisited() {
    const ret = await this.userService.resetVisited()
    this.loadUsers()
  }

  loadUsers() {

    this.route.queryParams.subscribe(params => {
      if (params['userId'] && this.paramsUsed == false) {
        this.userId = params['userId'];
        this.location.replaceState(this.location.path().split('?')[0], '');
        this.paramsUsed = true;
        if (this.userService.getCurrentUserId() as string != this.userId) {
          this.userService.addVisit(this.userId);
        }
      } else {
        this.userService.getRandomUser().subscribe((user:(User|null)) => {
          if (user) {
            this.userId = String(user._id);
          } else {
            this.userId = ""
          }
        });      
      }
    });
  }

  @HostListener('window:resize', [])
  onResize() { 
    const element=document.querySelector('.users-flow');
    this.renderer.setStyle(element, 'width', window.innerWidth < 500/0.9 ? window.innerWidth * 0.90 + 'px' : '500px');
  }
  

  private initialX = 0;
  private initialY = 0;
  private offsetX = 0;
  private offsetY = 0;
  isDragging = false;


  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.initialX = event.touches[0].clientX - this.offsetX;
    this.initialY = event.touches[0].clientY - this.offsetY;
    this.isDragging = true;
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (this.isDragging) {
      event.preventDefault();
      this.offsetX = event.touches[0].clientX - this.initialX;
      this.offsetY = event.touches[0].clientY - this.initialY;
      this.updateTransform();
    }
  }

  @HostListener('touchend')
  async onTouchEnd() {
    const offsetAction = 200;
    if (this.offsetY > offsetAction)
    {
      // Action quand on swipe vers le bas"
      this.loadUsers();
    }
    else if (this.offsetY < -offsetAction)
    {
      // Action quand on swipe vers le haut"
      this.loadUsers();
    }
    else if (this.offsetX > offsetAction)
    {
      // Action quand on swipe vers la droite"
      this.loadUsers();
    }
    else if (this.offsetX < -offsetAction)
    {
      // Action quand on swipe vers la gauche"
      this.loadUsers();
    }
    else
    {
      console.log("Le déplacement est insuffisant pour qu'une action ait lieu");
    }
    this.isDragging = false;
    
    const element = this.elementRef.nativeElement.querySelector('.users-flow');;
    this.renderer.setStyle(element, 'transform', `translate3d(0, 0, 0)`);
    this.offsetX = 0;
    this.offsetY = 0;
  }

  private updateTransform() {
    const element = this.elementRef.nativeElement.querySelector('.users-flow');
    this.renderer.setStyle(element, 'transform', `translate3d(${this.offsetX}px, ${this.offsetY}px, 0)`);
  }

  
}
