export class Album {
    title:string="";
    images:string[] = [];
    isHidden:boolean=false;
}

export class Information {
    type: string = "";
    text: string = "";
    isPrivate: boolean = false;
}

export class Relationship {
    type: string = "";
    userId: string = "";
    user : User | undefined;
}

export class Visit {
    userId: string = "";
    date : Date = new Date(1900,1,1);
}

export class User {
    _id: number= 0;
    eMail: string = "";
    firstname: string = "";
    image:string="";
    albums: Album[] = [];
    informations: Information[] = [];
    labels: [] = [];
    lastname: string = "";
    relationships:Relationship[]=[];
    username:string="";
    profile:string="";
    dateOfBirth:Date=new Date();
    userObject : User | undefined;
    visits : Visit [] = [];
    isAdmin:boolean = false;
  }