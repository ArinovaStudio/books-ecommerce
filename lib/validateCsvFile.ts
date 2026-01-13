import {z} from "zod";


export const CsvFile = z.array(z.object({
    "preview":z.string(),
    "name":z.string(),
    "brand":z.string(),
    "description": z.string(),
    "stock":z.number().min(1,"Minimum Value Must Be 1"),
    "price":z.number().min(1,"Minimum Price Must Be 1"),
    "category": z.enum(["TEXTBOOK","NOTEBOOK"])
}));