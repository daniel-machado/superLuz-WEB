
import api from "./api";


export const biblicalService = {
  bibleChapterDay: async (): Promise<any> => {
    const res = await api.get("/bible/capitulo-do-dia", {
    });
    const data = res.data;
    return data
  },
};
