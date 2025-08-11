# lots
Building a small task managent system


#  Goal I want you to build and design a small task management app of similar domains e.g a notes app, contact or inventory items. The app must allow authenticated users  to create, read, and delete items. The UI should be polished and responsive. Your repository must be well structured, include a clear readme. and your app must be deployed with a live hosted url(firebase or vercel are acceptable.)

I was given 2 options option a mern stack
requirements backend node.js + express(I prefer this), database mingodb or local with clear setup instruction(I have mysql workbench installed locally)

auth: json web tokens(jwt),(signup/login, token refresh optional)

restfull api with endpoints for primary resource(e.g /api/tasks)

frontend I want to use vite(hooks + functional components),

implement client soide auth(store token securely, e.g HttpOnly coockie recommended or local storage with explanation)

deploy backend and frontend. hosting should be free for the hackerthon I'm familiar with vercel and render but you should guide me step by step any cloud for backend will be fine also they said I should be able to provide live urls at the end

suggested features you can be creative add simple good ones:

pagination and search on the list view, client-side form validation , clean, responsive ;layout and basic styling


mandatory functional requirements:
user signup and login(persist session), crud for the primary resources (create, read/list, update, delete), each item should store: title/name, description, creadtedAt,updataedAt, ownerID(or user reference).

Input validation(both client and server/security rules)
, proper error handling and friendly ui messages.

non-functional requirements:

responsive ui that works on mobile and desktop,
clean, mordern look - user css framework(mui I prefer mui),

well-structured codebase with clear separation of backend and frontend. Like for this I want backend in next.js and fronted with vite, and mysql on my windows 11 pc .
meaning full readme with setup, run and deployment instructions, I already creade the github repo called lots and cloned it using gitbash: maxnd@ThePrimeagen MINGW64 ~/Documents/projects
$ git clone https://github.com/themaxempire23/lots.git
Cloning into 'lots'...
remote: Enumerating objects: 3, done.
remote: Counting objects: 100% (3/3), done.
remote: Total 3 (delta 0), reused 0 (delta 0), pack-reused 0 (from
Receiving objects: 100% (3/3), done.


I should use environtment, variables for secrets, Do not commit credentials,

test(unit or intergration) are bonus

deliverables for this hackerthon task are:

1. public git repository url on github which I already have, 
2. live deployed app url,
3. short demo video 2-5 minutes showing app and code paths.

4. readme containing steup steps, design decisions and trade offs, api contracts

5. deployed steps and steps used

evaluation rubric 100 points:

functional correctness (crud + auth): 35 points,
code structure and readability: 20 points,
ui/look & feel / responsiveness: 15 points,
deployment and readme: 10 points,
security best practices: 10 points,
test and extra: 10 points

bonus: extra polish: animations, accessibilty, darkmode,

I'm using a windows 11 pc, mysql workbench installed, vs code, using powershell as main terminal, gitbash,  node already install, (base) PS C:\Users\maxnd\Documents\projects\lots> node -v
v22.13.1,

please use compatible mui versions pleasse,

I want backend using next.js and vite for frontend lets do the important staff first backend I have postman installed aswell, I have an open ai api key aswell we can use to implement a cool ai feature please suggest and guide me through it nothing complex please

you are my coding coach and a master in coding software dev and all.

please provide me the exact codes to use lets only continue if I encountered no errors at a certain phase




