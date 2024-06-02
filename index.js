import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";

// consts:
const app = express();
const port = 3000;
const min_post_id = 1;
const max_post_id = 9999;

// global vars:
var data_global = {}; // holds all page's data, including all posts

// init website settings:
init_website_settings();

function init_website_settings () {

    data_global.posts = {};

    // dbg:
    generate_random_posts(10);

}

function generate_random_date_between (start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function generate_random_word_in_length (min_len, max_len) {
    
    var rand_word = '';
    var chars = 'abcdefghijklmnopqrstuvwxyz';
    var rand_len = Math.floor(Math.random() * (max_len - min_len + 1)) + min_len;
    
    for (var i=0 ; i<rand_len ; i++) {

        var rand_char_idx = Math.floor(Math.random() * chars.length);
        var rand_char = chars.charAt(rand_char_idx);
        rand_word += rand_char;

    }

    return rand_word;

}

function generate_random_paragraph_by_words_num (min_words_num, max_words_num) {

    var rand_paragraph = '';
    var rand_num_words = Math.floor(Math.random() * (max_words_num - min_words_num)) + min_words_num;

    for (var i=0 ; i<rand_num_words ; i++) {

        if (i !== 0) {
            rand_paragraph += ' ';
        }
        
        var rand_word = generate_random_word_in_length(1, 20);
        rand_paragraph += rand_word

    }

    return rand_paragraph;

}

function generate_random_posts (num_posts, post_size) {

    for (var i=0 ; i<num_posts ; i++) {

        var rand_id = get_random_post_id(min_post_id, max_post_id);
        var post_title = '';
        var post_content = '';

        switch (post_size) {

            case 'rand':

                post_title = generate_random_paragraph_by_words_num(1,20);
                post_content = generate_random_paragraph_by_words_num(1,400);
                break;

            case 'smallest':

                post_title = generate_random_paragraph_by_words_num(1,2);
                post_content = generate_random_paragraph_by_words_num(1,2);
                break;

            case 'big_title':

                post_title = generate_random_paragraph_by_words_num(15,20);
                post_content = generate_random_paragraph_by_words_num(1,2);
                break;

            case 'big_content':

                post_title = generate_random_paragraph_by_words_num(1,2);
                post_content = generate_random_paragraph_by_words_num(300,400);
                break;
                
            case 'biggest':

                post_title = generate_random_paragraph_by_words_num(15,20);
                post_content = generate_random_paragraph_by_words_num(200,400);
                break; 

            default:

                post_title = generate_random_paragraph_by_words_num(1,20);
                post_content = generate_random_paragraph_by_words_num(1,400);
                break;

        }

        data_global.posts[rand_id] = {
            // title: 'title ' + rand_id,
            // content: 'content ' + rand_id,
            title: post_title,
            content: post_content,
            date: generate_random_date_between(new Date(2023, 0, 1), new Date()).toLocaleString()
        };

    }
    
}

// display http requests data in console for debug:
app.use(morgan('tiny'));

// set the default path for statuc pages (such as css files):
app.use(express.static("public"));

// automaticly parse received data from form "POST" method (for example when adding a post/article):
app.use(bodyParser.urlencoded({extended: true}));

// display all posts in homepage:
app.get("/", (req, res) => {

    // copy global data to add locally:
    var data = Object.assign({}, data_global);

    // // dbg:
    // console.log('data_global: ' + JSON.stringify(data_global));
    // console.log('data: ' + JSON.stringify(data));

    res.render('index.ejs', data);

})

// new post page:
app.get('/new_post', (req, res) => {

    // copy global data to add locally:
    var data = Object.assign({}, data_global);

    // prepare data for new post:
    data.edit_post = {
        action: 'create_new_post',
        title_value: '',
        content_value: '',
        submit_name: 'submit_new_post',
        submit_value: 'create new post'
    };

    // // dbg:
    // console.log('data_global: ' + JSON.stringify(data_global));
    // console.log('data: ' + JSON.stringify(data));

    res.render('edit_post.ejs', data);

});

function get_random_post_id (min_post_id, max_post_id) {
    const rand_post_id = Math.floor(Math.random() * (max_post_id - min_post_id + 1)) + min_post_id;
    return rand_post_id;
}

// create new post, then redirect to homepage:
app.post('/create_new_post', (req, res) => {

    // copy global data to add locally:
    var data = Object.assign({}, data_global);
    
    // init automatic data for new post (such as post id and date):
    const rand_post_id = get_random_post_id(min_post_id, max_post_id);
    const curr_date = new Date();

    // todo:
    // deal with existing id's.
    // try to prefix date or more.
    // be carefull of infinite or long loop (normal rand+check could take forever when only 1 id is available) and losing user's post content on error

    // get and prepare new post data from form POST method:
    var post_title = req.body.title;
    var post_content = req.body.content;

    // add new post to global db:
    data_global.posts[rand_post_id] = {
        content: post_content,
        title: post_title,
        date: curr_date.toLocaleString()
    };

    // // dbg:
    // console.log('data_global: ' + JSON.stringify(data_global));
    // console.log('data: ' + data);

    // display all posts by redirecting to homepage:
    res.redirect('/');

});

app.post('/edit_post', (req, res) => {

    // copy global data to add locally:
    var data = Object.assign({}, data_global);

    // get the data of the post to edit (recieved by form POST method):
    var post_id = req.body.post_id;
    var submit_edit_post = req.body.edit_post;

    // prepare data for edit post webpage:
    data.edit_post = {
        action: 'update_post',
        post_id: post_id,
        title_value: data.posts[post_id].title,
        content_value: data.posts[post_id].content,
        submit_name: 'edit_post',
        submit_value: 'edit post'
    };

    // // dbg:
    // console.log('data_global: ' + JSON.stringify(data_global));
    // console.log('data: ' + JSON.stringify(data));

    res.render('edit_post.ejs', data);

});

app.post('/update_post', (req, res) => {

    // copy global data to add locally:
    var data = Object.assign({}, data_global);

    // get and prepare new post data from form POST method:
    var post_id = req.body.post_id;
    var post_title = req.body.title;
    var post_content = req.body.content;

    // update post in global db:
    data_global.posts[post_id].content = post_content;
    data_global.posts[post_id].title = post_title;

    // // dbg:
    // console.log('data_global: ' + JSON.stringify(data_global));
    // console.log('data: ' + data);

    // display all posts by redirecting to homepage:
    res.redirect('/');

});

app.post('/del_post', (req, res) => {

    // copy global data to add locally:
    var data = Object.assign({}, data_global);

    // get the data of the post to del (recieved by form POST method):
    var post_id = req.body.post_id;

    // del post from global db:
    delete data_global.posts[post_id];

    // // dbg:
    // console.log('data_global: ' + JSON.stringify(data_global));
    // console.log('data: ' + JSON.stringify(data));

    res.redirect('/');

});

app.get('/new_rand_post', (req, res) => {

    generate_random_posts(1, 'rand');
    res.redirect('/');

});

app.get('/new_rand_post_smallest', (req, res) => {

    generate_random_posts(1, 'smallest');
    res.redirect('/');

});

app.get('/new_rand_post_big_title', (req, res) => {

    generate_random_posts(1, 'big_title');
    res.redirect('/');

});

app.get('/new_rand_post_big_content', (req, res) => {

    generate_random_posts(1, 'big_content');
    res.redirect('/');

});

app.get('/new_rand_post_biggest', (req, res) => {

    generate_random_posts(1, 'biggest');
    res.redirect('/');

});

// open a server to listen for http requests in a specific port:
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});