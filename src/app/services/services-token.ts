import { InjectionToken } from "@angular/core";
import { IUserService } from "./api/user/user-service.interface";
import { IPackageService } from "./api/package/package-service.interface";

export const SERVICES_TOKEN = {
  HTTP: {
    PACKAGE: new InjectionToken<IPackageService>('SERVICES_TOKEN.HTTP.PACKAGE'),
    USER: new InjectionToken<IUserService>('SERVICES_TOKEN.HTTP.USER')
  }
}
