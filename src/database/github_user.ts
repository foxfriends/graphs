import { client } from './client.ts';

export type GithubUser {
  login: string;
  avatarUrl: string;
}

export function getUserByLogin(login: string): GithubUser | null {

}
