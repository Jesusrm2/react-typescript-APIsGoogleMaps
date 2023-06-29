export interface IFormInput {
    days: number;
    dateStart: string;
    hourStart: string;
    hourEnd: string;
    lunchTimeStart: string;
    lunchTimeEnd:string;
    poi: OptionType[];
  }
  
  export  interface OptionType {
    value: string;
    label: string;
  }