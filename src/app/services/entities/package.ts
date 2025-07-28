import { PackageDate } from './package-date';

export class Package {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public destination: string,
        public duration: number,
        public price: number,
        public maxPeople: number,
        public packageDates: PackageDate[],
        public createdAt: Date,
        public updatedAt: Date
    ){

    }
}
