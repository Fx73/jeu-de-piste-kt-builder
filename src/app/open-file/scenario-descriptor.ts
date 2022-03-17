export class ScenarioDescriptor {
  name: string;
  creator: string;
  description: string;
  icon: string | ArrayBuffer;
  owner: string;

  constructor(name: string, creator: string, description: string, icon: string | ArrayBuffer, owner: string = null){
    this.name = name;
    this.creator = creator;
    this.description = description;
    this.icon = icon ;
    this.owner = owner;
  }

  static ownFactory(name: string, creator: string, description: string, icon: string | ArrayBuffer): ScenarioDescriptor{
    return new ScenarioDescriptor(name, creator, description, icon);
  }
  static sharedFactory(name: string, creator: string, owner: string): ScenarioDescriptor{
    return new ScenarioDescriptor(name, creator, '','', owner);
  }




  key(){
    return this.name + '_' + this.creator;
  }
  file(){
    return this.key() + '.sc';
  }





  toObject(): object{
    if(!this.name || !this.creator){
      return null;
    }

    if(!this.description || !this.icon){
        return{
        name: this.name,
        creator : this.creator,
        owner: this.owner
      };
    }

    return {
      name: this.name,
      creator : this.creator,
      description: this.description,
      icon: this.icon,
      owner: this.owner ?? ''
    };
  }
}
