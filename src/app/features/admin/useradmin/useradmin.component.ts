import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminlayoutComponent } from '../adminlayout/adminlayout.component';
import { UsersService } from '../../../core/services/users.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../../core/services/dasboard.service';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isVerified: boolean;
  updatedAt: Date;
  isSubscribedToNewsService: boolean;
}

@Component({
  selector: 'app-useradmin',
  standalone: true,
  imports: [CommonModule, AdminlayoutComponent, HttpClientModule, FormsModule],
  templateUrl: './useradmin.component.html',
})
export class UseradminComponent implements OnInit {
  users: any[] = [];
  currentPage = 1;
  limit = 10;
  pages: number[] = [];
  totalPages = 0;
  totalUsers = 0;
  searchTerm: string = '';
  selectedUser: User | null = null;

  showModal: boolean = false;


  constructor(private userService: UsersService, private dashboardService: DashboardService) { }

  ngOnInit() {
    this.fetchUsers();
  }

  generatePages() {
    this.pages = [];

    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.fetchUsers();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchUsers();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchUsers();
    }
  }
  fetchUsers() {
  this.userService.getUsers(this.currentPage, this.limit).subscribe((res: any) => {
    this.users = res.data.users;      
    this.totalUsers = res.data.total;  
    this.totalPages = res.data.totalPages;
    this.generatePages();

    this.dashboardService.setTotalUsers(this.totalUsers);
    this.dashboardService.setFirst10Users(this.users);

    console.log('Useradmin Total Users:', this.totalUsers);

  })}
  filteredUsers() {
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(
      (u) =>
        u.firstName.toLowerCase().includes(term) ||
        u.lastName.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.role.toLowerCase().includes(term)
    );
  }

  showUser(id: string) {
    if (!id) return;

    this.userService.getUserBYId(id).subscribe({
      next: (res: any) => {
        const user = res?.data?.user || res?.data || null;

        if (user) {
          this.selectedUser = user;
          this.showModal = true;
        } else {
          console.warn("User not found", res);
        }
      },
      error: (err) => console.error(err),
    });
  }


  closeModal() {
    this.showModal = false;
    this.selectedUser = null;
  }


  editMode = false;
  editUserData: any = {};
  selectedUserId: string = "";


  openEditModal(user: any) {
    this.selectedUserId = user._id;
    this.editUserData = { ...user };
    this.editMode = true;
  }

  saveUserEdits() {
    this.userService.updateUser(this.selectedUserId, this.editUserData).subscribe({
      next: (res) => {
        console.log("User updated:", res);

        this.editMode = false;
        this.fetchUsers();
      },
      error: (err) => {
        console.error("Update error:", err);
      }
    });
  }

  deleteUser(user: any) {
    if (!confirm(`Are you want to delete ${user.firstName}?`)) return;
    this.userService.deleteUser(user._id).subscribe({
      next: (res) => {
        this.users = this.users.filter(u => u._id == user._id);
        console.log("user deleted");

        this.fetchUsers();
      },
      error: (err) => {
        console.error(err);

      }
    })
  }
}
