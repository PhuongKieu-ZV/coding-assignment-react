import { User } from '@acme/shared-models';
import axiosClient from '../middleware/axiosClient';

export default class UserService {
  static getUsers(): Promise<Array<User>> {
    return axiosClient.get('/users');
  }

  static getUser(id: number): Promise<User> {
    return axiosClient.get(`/users/${id}`);
  }
}
