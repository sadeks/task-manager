const db = require('monk')(process.env.MONGO_URL);

const collection = 'tasks';

const tasksCollection = db.get(collection);

const mockTasksList = [
{
    title: 'task 1',
    description: 'Bacon ipsum dolor amet tenderloin swine spare ribs capicola pig cow salami pork belly tri-tip sausage landjaeger doner pork ham hock pancetta. Pancetta buffalo salami strip steak, turducken ham frankfurter sirloin meatball rump boudin t-bone kevin turkey tenderloin. Flank pancetta short ribs sausage kevin short loin. Bacon pork chop shoulder jowl, t-bone fatback kielbasa.',
    due: new Date('2018/08/09')
},
{
    title: 'task 2',
    description: 'Ipsum shankle pastrami dolore venison capicola elit short loin prosciutto. Excepteur laborum reprehenderit, venison boudin turducken filet mignon kevin. Ut leberkas pig pork belly reprehenderit adipisicing est shoulder velit. Jerky ribeye dolore, sausage ut ham ad dolor chuck anim qui in shoulder in doner.',
    due: new Date('2018/08/01')
},
{
    title: 'task 3',
    description: 'Cow cupidatat dolore, do picanha eu incididunt beef ribs ipsum ham consequat. Frankfurter laboris laborum ribeye pork chop ex velit shoulder voluptate in tri-tip. Eiusmod pork belly deserunt biltong spare ribs leberkas rump ut meatball enim turducken. Proident pancetta jowl turducken shoulder, corned beef kielbasa elit shank ad.',
    due: new Date('2018/08/05')
}
]

var populateDBWithTasks = async () =>{
    return await tasksCollection.insert(mockTasksList);
}

module.exports = {

    populateDBWithTasks: populateDBWithTasks

}