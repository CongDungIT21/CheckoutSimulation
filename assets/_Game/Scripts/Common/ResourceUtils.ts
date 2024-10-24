import { Prefab, resources } from "cc"

export class ResourceUtils {

    public static async loadPrefabAsync(path: string): Promise<Prefab> {
        return new Promise((resolve, reject) => {
            resources.load(path, Prefab, (err, prefab) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(prefab);
                }
            });
        })
    }

    public static async loadDirectoryPrefabAsync(path: string): Promise<Prefab[]> {
        return new Promise((resolve, reject) => {
           resources.loadDir(path, Prefab, (err, prefabs) => {
               if (err) {
                    reject(err);
               } else {
                    resolve(prefabs);
               }
           }) 
        });
    }
}