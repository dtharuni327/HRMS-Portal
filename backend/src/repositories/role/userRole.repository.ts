const userRolesTable: any[] = [];

export const userRoleRepository = {
  async findAssignment(userId: string, roleId: string) {
    return userRolesTable.find(ur => ur.userId === userId && ur.roleId === roleId);
  },

  async findByUserId(userId: string) {
    return userRolesTable.filter(ur => ur.userId === userId);
  },

  async assign(userId: string, roleId: string) {
    const assignment = { id: Date.now().toString(), userId, roleId, assignedAt: new Date() };
    userRolesTable.push(assignment);
    return assignment;
  },

  async updateUserRole(userId: string, newRoleId: string) {
    // Assuming a user has one primary role for simplicity; adjusts if they can have multiple
    const index = userRolesTable.findIndex(ur => ur.userId === userId);
    if (index === -1) {
      return this.assign(userId, newRoleId);
    }
    userRolesTable[index].roleId = newRoleId;
    userRolesTable[index].updatedAt = new Date();
    return userRolesTable[index];
  }
};