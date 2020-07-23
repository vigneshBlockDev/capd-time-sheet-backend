const express = require("express");
const app = express();
// require('./functions/Scheduler').Scheduler();
const cors = require('cors');
const path = require('path');
const { connectionCheck, getConnection, insert_query, query_execute, connectionRelease } = require('./connection');
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

app.use(express.json());
connectionCheck();



app.get('/app', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/api/registerUser',async(req,res) => {
    const { user } = req.body;
    console.log(user);
    let values = [];
    Object.entries(user).map((value, key) => {
        values.push(value[1]);
    });
    console.log(values);
    let response = await insert_query(`INSERT INTO  webdata4.user(User_Name,Password) values ?`, values);
    console.log(response);
    if(response.status === 200){
        return res.status(200).json({status:200,message:'Register Succesfull'});
    }
    return res.status(400).json({status:400,message:'Register Failed'});
});

app.get('/api/getLoginDetails',async(req,res) => {
    const user = await query_execute(`select * from webdata4.user`);
    res.send(user);
})

app.post("/api/login",async(req,res) => {
    const { userName: email, password } = req.body.values;
    console.log(email, password);
    let response = {};
    const user = await query_execute(`select * from webdata4.user where user.User_Name = '${email}'`);
    console.log(user);
    if (user.status === 200 && user.data.length > 0) {
        if (user.data[0].Password === password) {
            return res.status(200).json({ status: 200, message: 'Login Success', isAdmin: user.data[0].isAdmin });
        } else {
            return res.status(400).json({ status: 400, message: 'Login Failure' });
        }
    } else {
        return res.status(404).json({ status: 404, message: 'User Not Found' });
    }
})

app.post('/api/login', async (req, res) => {
    const { userName:email, password } = req.body.values;
    const response = {};
    if (email === 'admin-capd-time-sheet@gmail.com' && password === '#Include<admin.h>') {
        response['isAdmin'] = true;
        return res.status(200).json(response);
        } else if (email === 'user-capd-time-sheet@gmail.com' && password === '#Include<user.h>') {
            response['isAdmin'] = false;
        return res.status(200).json(response);
    } else {
        return res.json({ status: 400, message: 'Login Failed' });
    }
});

app.get('/api/getresources', async (req, res) => {
    let response = [];
    response = await query_execute(`SELECT * FROM webdata4.resources where resources.Delete = 'N'`);
    res.json(response);
});

app.post(`/api/updateresources`, async (req, res) => {
    const { user } = req.body;
    let set = '';
    let objectLength = Object.keys(user).length - 1;
    console.log(objectLength);
    Object.entries(user).map((value, key) => {
        ssss
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
    let response = await query_execute(`UPDATE webdata4.resources SET ${set} where Resource_ID = ?`, user.Resource_ID);
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
    let response = await insert_query(`INSERT INTO  webdata4.resources (Resource_ID,Resource_Name,SOW_Category,Billing_Type,City,Shore,Skill_Set) values ?`, values);
    console.log(response);
    res.json(response);
});

app.post('/api/deleteresources', async (req, res) => {
    const { user } = req.body;
    let response = await query_execute(`DELETE FROM  webdata4.resources  where Resource_ID = ?`, user.Resource_ID);
    console.log(response);
    res.json(response);
})

app.get('/api/getprojects', async (req, res) => {
    let response = [];
    response = await query_execute(`SELECT * FROM webdata4.projects where projects.Delete = 'N'`);
    res.json(response);
});

app.post(`/api/updateproject`, async (req, res) => {
    const { project } = req.body;
    let set = '';
    let objectLength = Object.keys(project).length - 1;
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
    let response = await query_execute(`UPDATE webdata4.projects SET ${set} where Project_ID = ?`, project.Project_ID);
    res.json(response);
});

app.post(`/api/addProjects`, async (req, res) => {
    const { project } = req.body;
    let values = [];
    Object.entries(project).map((value, key) => {
        values.push(value[1]);
    });
    console.log(values);
    let response = await insert_query(`INSERT INTO  webdata4.projects (Project_ID,Project_Code,Project_Name) values ?`, values);
    console.log(response);
    res.json(response);
});

app.post('/api/deleteproject', async (req, res) => {
    const { project } = req.body;
    let response = await query_execute(`DELETE FROM  webdata4.projects  where Project_ID = ?`, project.Project_ID);
    console.log(response);
    res.json(response);
})


app.get('/api/getskills', async (req, res) => {
    let response = [];
    response = await query_execute(`SELECT * FROM webdata4.skill where skill.Delete = 'N'`);
    res.json(response);
});

app.post(`/api/updateskill`, async (req, res) => {
    const { skill } = req.body;
    let set = '';
    let objectLength = Object.keys(skill).length - 1;
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
    let response = await query_execute(`UPDATE webdata4.skill SET ${set} where Skill_ID = ?`, skill.Skill_ID);
    res.json(response);
});

app.post(`/api/addskill`, async (req, res) => {
    const { skill } = req.body;
    let values = [];
    Object.entries(skill).map((value, key) => {
        values.push(value[1]);
    });
    console.log(values);
    let response = await insert_query(`INSERT INTO  webdata4.skill (Skill_ID,Skill_Name) values ?`, values);
    console.log(response);
    res.json(response);
});

app.post('/api/deleteskill', async (req, res) => {
    const { skill } = req.body;
    let response = await query_execute(`DELETE FROM  webdata4.skill  where Skill_ID = ?`, skill.Skill_ID);
    console.log(response);
    res.json(response);
});


app.get('/api/getResourceTimeSheet', async (req, res) => {
    let response = await query_execute(`select cd.project_id,cd.project_name,cd.resource_name,wd.week_number,wd.to_date
    from webdata4.week_details wd, webdata4.capacity_demand cd,webdata4.registered_user ru  where ru.user_id=cd.user_id and  month='jan' and year ='2020' and week_number = 'week 01'`);
    res.json(response);
})


app.get('/api/getAllData', async (req, res) => {
    let week  = await query_execute(`SELECT * FROM week_details`);
    let projects  = await query_execute(`SELECT * FROM projects`);
    let resources = await query_execute(`SELECT * FROM resources`);
    let skill  = await query_execute(`SELECT * FROM skill`)
    res.json({ week: week.data, projects: projects.data, resources: resources.data, skill: skill.data });
});

app.post('/api/assignTaskToResoruce', async (req, res) => {
    const { values:timesheet } = req.body;
    console.log(timesheet);
    let values = [];
    Object.entries(timesheet).map((value, key) => {
        values.push(value[1]);
    });
    console.log(values);
    let response = await insert_query(`INSERT INTO  webdata4.capacity_demand(Project_Code,Project_Name,Resource_Name,To_Date,Year,Month,Actual_Hours,Planned_Hours,Resource_ID) values ?`, values);
    console.log(response);
    res.json(response);
});
app.get('/api/getTimeSheetRecord',async(req,res) => {
    const { month,year,resourcename } = req.body;
    let response = await insert_query(`Select * from webdata4.capacity_demand where Month='jan' and Year='2020' and Resource_Name='Suresh Susarla' `);
    console.log(response);
    res.json(response);
})

app.get('/api/fetchMonthYear',async(req,res) => {
    const data = await query_execute(`select distinct week_ID,month,year,To_Date from week_details `);
    console.log(data);
    res.send(data);
})

app.get('/api/fetchTransactionDetails',async(req,res) => {
    const data = await query_execute(`select * from projects`);
    console.log(data);
    res.send(data);
})

const port = 4000;

app.listen(port, () => console.log(`Listening on port ${port}...`));


