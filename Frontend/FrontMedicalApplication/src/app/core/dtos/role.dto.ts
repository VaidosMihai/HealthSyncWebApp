export class RoleDto {
    roleId?: number;
    name: string;
  
    constructor(name: string = '', roleId?: number) {
      this.name = name;
      if (roleId) {
        this.roleId = roleId;
      }
    }
  }
  