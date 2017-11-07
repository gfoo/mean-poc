import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class BlogService {

  domain = "";
  authToken;
  headers;

  constructor(private http: HttpClient) { }


  createAuthenticationHeaders() {
    this.loadToken();
    this.headers = new HttpHeaders().set('Authorization', this.authToken);
  }

  loadToken() {
    this.authToken = localStorage.getItem('token');
  }

  newBlog(blog) {
    this.createAuthenticationHeaders();
    return this.http.post(
      this.domain + "/blogs/newBlog",
      blog,
      { headers: this.headers }
    );
  }

  getAllBlogs() {
    this.createAuthenticationHeaders();
    return this.http.get(
      this.domain + "/blogs/allBlogs",
      { headers: this.headers }
    );
  }

  getSingleBlog(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + '/blogs/singleBlog' + id,
      { headers: this.headers }
    );
  }

  editBlog(blog) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + '/blogs/updateBlog', blog,
      { headers: this.headers }
    );
  }

  deleteBlog(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.delete(this.domain + '/blogs/deleteBlog' + id,
      { headers: this.headers }
    );
  }

  // Function to like a blog post
  likeBlog(id) {
    const blogData = { id: id };
    return this.http.put(this.domain + '/blogs/likeBlog', blogData,
      { headers: this.headers }
    );
  }

  // Function to dislike a blog post
  dislikeBlog(id) {
    const blogData = { id: id };
    return this.http.put(this.domain + '/blogs/dislikeBlog', blogData,
      { headers: this.headers }
    );
  }

  postComment(id, comment) {
    this.createAuthenticationHeaders();
    const blogData = {
      id: id,
      comment: comment
    }
    return this.http.post(this.domain + '/blogs/comment', blogData, { headers: this.headers });
  }
}
