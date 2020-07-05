const express = require("express");
const app = express();
// require('./functions/Scheduler').Scheduler();
const cors = require('cors');
const path = require('path');
const {connectionCheck,getConnection,insert_query,query_execute,connectionRelease } =require('./connection');
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

app.use(express.json());
connectionCheck();

app.get('/app', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
app.get('/api/getresources', async (req, res) => {
    let response = [];
    response  = await query_execute(`SELECT * FROM webdata4.resources where resources.Delete = 'N'`);
    res.json(response);
});

app.post(`/api/updateresources`, async (req, res) => {
    const { user } = req.body;
    let set = '';
    let objectLength =  Object.keys(user).length -1;
    console.log(objectLength);
    Object.entries(user).map((value, key) => {ssss
        console.log(key);
        if (key !== objectLength) {
            if (key > 0) {
                set += `${value[0]}='${value[1]}',`;
            }
        } else {
            set += `${value[0]}='${value[1]}'`;
        }
    })
    console.log(set);
    let response = await query_execute(`UPDATE webdata4.resources SET ${set} where Resource_ID = ?`,user.Resource_ID);
    console.log(response);
    res.json(response);
});

app.post(`/api/addResources`, async (req, res) => {
    const { user } = req.body;
    let values = [];
    Object.entries(user).map((value, key) => {
        values.push(value[1]);
    });
    console.log(values);
    let response = await insert_query(`INSERT INTO  webdata4.resources (Resource_ID,Resource_Name,SOW_Category,Billing_Type,City,Shore,Skill_Set) values ?`,values);
    console.log(response);
    res.json(response);
});

app.post('/api/deleteresources',async(req,res) => {
    const { user } = req.body;
    let response = await query_execute(`DELETE FROM  webdata4.resources  where Resource_ID = ?`,user.Resource_ID);
    console.log(response);
    res.json(response);
})

app.get('/api/getprojects', async (req, res) => {
    let response = [];
    response  = await query_execute(`SELECT * FROM webdata4.projects where projects.Delete = 'N'`);
    res.json(response);
});

app.post(`/api/updateproject`, async (req, res) => {
    const { project } = req.body;
    let set = '';
    let objectLength =  Object.keys(project).length -1;
    Object.entries(project).map((value, key) => {
        console.log(key);
        if (key !== objectLength) {
            if (key > 0) {
                set += `${value[0]}='${value[1]}',`;
            }
        } else {
            set += `${value[0]}='${value[1]}'`;
        }
    })
    let response = await query_execute(`UPDATE webdata4.projects SET ${set} where Project_ID = ?`,project.Project_ID);
    res.json(response);
});

app.post(`/api/addProjects`, async (req, res) => {
    const { project } = req.body;
    let values = [];
    Object.entries(project).map((value, key) => {
        values.push(value[1]);
    });
    console.log(values);
    let response = await insert_query(`INSERT INTO  webdata4.projects (Project_ID,Project_Code,Project_Name) values ?`,values);
    console.log(response);
    res.json(response);
});

app.post('/api/deleteproject',async(req,res) => {
    const { project } = req.body;
    let response = await query_execute(`DELETE FROM  webdata4.projects  where Project_ID = ?`,project.Project_ID);
    console.log(response);
    res.json(response);
})


app.get('/api/getskills', async (req, res) => {
    let response = [];
    response  = await query_execute(`SELECT * FROM webdata4.skill where skill.Delete = 'N'`);
    res.json(response);
});

app.post(`/api/updateskill`, async (req, res) => {
    const { skill } = req.body;
    let set = '';
    let objectLength =  Object.keys(skill).length -1;
    Object.entries(skill).map((value, key) => {
        console.log(key);
        if (key !== objectLength) {
            if (key > 0) {
                set += `${value[0]}='${value[1]}',`;
            }
        } else {
            set += `${value[0]}='${value[1]}'`;
        }
    })
    let response = await query_execute(`UPDATE webdata4.skill SET ${set} where Skill_ID = ?`,skill.Skill_ID);
    res.json(response);
});

app.post(`/api/addskill`, async (req, res) => {
    const { skill } = req.body;
    let values = [];
    Object.entries(skill).map((value, key) => {
        values.push(value[1]);
    });
    console.log(values);
    let response = await insert_query(`INSERT INTO  webdata4.skill (Skill_ID,Skill_Name) values ?`,values);
    console.log(response);
    res.json(response);
});

app.post('/api/deleteskill',async(req,res) => {
    const { skill } = req.body;
    let response = await query_execute(`DELETE FROM  webdata4.skill  where Skill_ID = ?`,skill.Skill_ID);
    console.log(response);
    res.json(response);
})


const port = 4000;

app.listen(port, () => console.log(`Listening on port ${port}...`));


