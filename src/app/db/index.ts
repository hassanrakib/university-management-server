import config from "../config"
import { USER_ROLE } from "../modules/user/user.constant"
import { User } from "../modules/user/user.model"


const superAdmin = {
        id: '0001',
        email: 'admin@universitymserver.com',
        password: config.super_admin_password,
        needsPasswordChange: false,
        role: USER_ROLE.superAdmin,
}

const seedSuperAdmin = async () => {
    // check if there is any super admin in the user collection
    const isSuperAdminExist = await User.findOne({role: USER_ROLE.superAdmin});

    // if no super admin, create one
    if(!isSuperAdminExist) await User.create(superAdmin);

}

export default seedSuperAdmin;