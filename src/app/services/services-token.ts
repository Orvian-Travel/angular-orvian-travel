import { InjectionToken } from "@angular/core";
import { Package } from "./api/package/package";
import { IUserService } from "./api/user/user-service.interface";

export const SERVICES_TOKEN = {
  HTTP: {
    PACKAGE: new InjectionToken<Package>('SERVICES_TOKEN.HTTP.PACKAGE'),
    USER: new InjectionToken<IUserService>('SERVICES_TOKEN.HTTP.USER')
  }
}
