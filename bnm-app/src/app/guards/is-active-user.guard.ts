import { inject } from "@angular/core";
import { CanActivateChildFn, CanActivateFn, Router } from "@angular/router";


const checkIfActive = () => {
  const router = inject(Router)
  //if localStorage isUserActive is false, redirect to not-allowed-user page 
  if (localStorage.getItem('isUserActive') == 'false') {
    router.navigate(["not-allowed-user"])

    return false
  }
  return true
}

export const isActiveGuard: CanActivateFn = (route, state) => {
  return checkIfActive()
}
export const isActiveGuardChildren: CanActivateChildFn = (route, state) => {
  return checkIfActive()
}