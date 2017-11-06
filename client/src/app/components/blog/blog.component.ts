import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  messageClass;
  message;
  newPost = false;
  loadingBlogs = false;
  form: FormGroup;
  processing = false;
  username;
  blogPosts;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService
  ) {
    this.createNewBlogForm(); // Create new blog form on start up
  }

  ngOnInit() {
    // Get profile username on page load
    this.authService.getProfile().subscribe((profile: any) => {
      this.username = profile.user.username; // Used when creating new blog posts and comments
    });
    this.getAllBlogs();
  }

  getAllBlogs() {
    this.blogService.getAllBlogs().subscribe((data: any) => {
      this.blogPosts = data.blogs;
    });
  }

  // Enable new blog form
  enableFormNewBlogForm() {
    this.form.get('title').enable(); // Enable title field
    this.form.get('body').enable(); // Enable body field
  }

  // Disable new blog form
  disableFormNewBlogForm() {
    this.form.get('title').disable(); // Disable title field
    this.form.get('body').disable(); // Disable body field
  }

  createNewBlogForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])]
    })
  }

  // Validation for title
  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/); // Regular expression to perform test
    // Check if test returns false or true
    if (regExp.test(controls.value)) {
      return null; // Return valid
    } else {
      return { 'alphaNumericValidation': true } // Return error in validation
    }
  }

  onBlogSubmit() {
    this.processing = true;
    this.disableFormNewBlogForm();
    // Create blog object from form fields
    const blog = {
      title: this.form.get('title').value, // Title field
      body: this.form.get('body').value, // Body field
      createdBy: this.username // CreatedBy field
    }

    // Function to save blog into database
    this.blogService.newBlog(blog).subscribe((data: any) => {
      // Check if blog was saved to database or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return error class
        this.message = data.message; // Return error message
        this.processing = false; // Enable submit button
        this.enableFormNewBlogForm(); // Enable form
      } else {
        this.messageClass = 'alert alert-success'; // Return success class
        this.message = data.message; // Return success message
        this.getAllBlogs();
        // Clear form data after two seconds
        setTimeout(() => {
          this.newPost = false; // Hide form
          this.processing = false; // Enable submit button
          this.message = false; // Erase error/success message
          this.form.reset(); // Reset all form fields
          this.enableFormNewBlogForm(); // Enable the form fields
        }, 2000);
      }
    });
  }

  newBlogForm() {
    this.newPost = true; // Show new blog form
  }

  // Function to go back to previous page
  goBack() {
    window.location.reload(); // Clear all variable states
  }

  draftComment() {

  }

  reloadBlogs() {
    this.loadingBlogs = true;
    this.getAllBlogs();
    setTimeout(() => {
      this.loadingBlogs = false;
    }, 4000);

  }

  likeBlog(id) {
    // Service to like a blog post
    console.log("id: " + id)
    this.blogService.likeBlog(id).subscribe(data => {
      this.getAllBlogs(); // Refresh blogs after like
    });
  }

  // Function to disliked a blog post
  dislikeBlog(id) {
    // Service to dislike a blog post
    this.blogService.dislikeBlog(id).subscribe(data => {
      this.getAllBlogs(); // Refresh blogs after dislike
    });
  }

}
