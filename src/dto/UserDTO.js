export class UserDto {
    constructor({
      id = null,
      fio = '',
      email = '',
      role = null, // Default role, could be dynamic
      isEnabled = false,
      isLocked = false,
      isRemindEnabled = true,
      createdAt = null,
      updatedAt = null,
    } = {}) {
      this.id = id;
      this.fio = fio;
      this.email = email;
      this.role = role;
      this.isEnabled = isEnabled;
      this.isLocked = isLocked;
      this.isRemindEnabled = isRemindEnabled;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }
  