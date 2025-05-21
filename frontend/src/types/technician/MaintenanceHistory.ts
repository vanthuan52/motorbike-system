export interface MaintenanceHistory {
    id: number;
    customer_id: string;
    vehicle_id: string;
    details : {
        glass?:{
            value:number;
            note?:string | null;
        },
        fork?:{
            value:number;
            note?:string | null;
        },
        brake?:{
            value:number;
            note?:string | null;
        },
        oil_filter?:{
            value:number;
            note?:string | null;
        },
        air_filter?:{
            value:number;
            note?:string | null;
        },
        saddle?:{
            value:number;
            note?:string | null;
        },
        light?:{
            value:number;
            note?:string | null;
        },
        percentage_before_maintenance?: number | null;
        percentage_after_maintenance?: number | null;
    };
    date: string;
}