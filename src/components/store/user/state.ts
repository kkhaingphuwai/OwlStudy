import { makeAutoObservable } from "mobx"

export class UserState {

    email: string = ''
    firstName: string = ''
    lastName: string = ''
    lastLoginTime: string = ''
    previousLoginTime: string = ''

    constructor() {
        makeAutoObservable(this)
    }

    setEmail(email: string) {
        this.email = email;
    }

    setFirstName(firstName: string) {
        this.firstName = firstName;
    }

    setLastName(lastName: string) {
        this.lastName = lastName;
    }

    setLastLoginTime(lastLoginTime: string) {
        this.lastLoginTime = lastLoginTime;
    }

    setPreviousLoginTime(previousLoginTime: string) {
        this.previousLoginTime = previousLoginTime
    }
}