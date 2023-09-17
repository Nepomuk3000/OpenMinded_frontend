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

export class Interaction {
    userId: string = "";
    dates : Date[] = [];
}


export class Requirements {
    searchRadius: number = 10;
    labels : [] = [];
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
    isAdmin:boolean = false;
    rejectedUsers:number[] = [];

    visited : Interaction [] = [];
    liked : Interaction [] = [];
    loved : Interaction [] = [];
    rejected : Interaction [] = [];

    visitedBy : Interaction [] = [];
    likedBy : Interaction [] = [];
    loveedBy : Interaction [] = [];
    rejectedBy : Interaction [] = [];
    requirements : Requirements = new Requirements();
  }