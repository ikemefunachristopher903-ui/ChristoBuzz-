// demoController.js
import demoUsers from "./demoData/demoUsers.json" assert { type: "json" };
import demoPosts from "./demoData/demoPosts.json" assert { type: "json" };
import demoProducts from "./demoData/demoProducts.json" assert { type: "json" };
import { registerView } from "./adnetwork.js";

export function demoUsersInit(){
  console.log("Demo Users Loaded:", demoUsers);
}

export function demoPostsInit(){
  console.log("Demo Posts Loaded:", demoPosts);
}

export function demoProductsInit(){
  console.log("Demo Products Loaded:", demoProducts);
  // simulate CPM ad views
  demoProducts.forEach(p=>{
    registerView(p.id);
  });
}
