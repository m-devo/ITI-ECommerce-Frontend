import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminlayoutComponent } from '../adminlayout/adminlayout.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthorService } from '../../../core/services/author.service';
interface Author_Req {
  _id?: string;
  user: {
    _id: string;
    email: string;
    role: string;
  };
  fullName?: string;
  bio?: string;
  idCard: string;
  selfie: string;
  status?: "pending" | "approved" | "rejected";
  adminNote?: string;
  createdAt?: string;
  updatedAt?: string;

}

@Component({
  selector: 'app-authoradmin',
  standalone: true,
  imports: [CommonModule,
    RouterModule, AdminlayoutComponent, HttpClientModule, FormsModule],
  templateUrl: './authoradmin.component.html',
  styleUrl: './authoradmin.component.css'
})
export class AuthoradminComponent {
  requests: any[] = [];
  currentPage = 1;
  limit = 10;
  pages: number[] = [];
  totalPages = 0;
  totalReq = 0;
  searchTerm: string = '';
  selectedReq: Author_Req | null = null;
  showModal: boolean = false;
  constructor(private requestSErvice: AuthorService) { }
  ngOnInit() {
    this.fetchRequests();
  }
  generatePages() {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.fetchRequests();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchRequests();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchRequests();
    }
  }
  fetchRequests() {
    this.requestSErvice.getRequests(this.currentPage, this.limit).subscribe({
      next: (res: any) => {
        this.requests = res.data.data;
        this.totalReq = res.data.totalRequests;
        this.totalPages = res.data.totalPages;
        this.generatePages();

        console.log(this.requests);
        console.log('totalReq:', this.totalReq);
      },
      error: (err) => console.error('Error fetching requests:', err)
    });
  }
  filteredREq() {
    const term = this.searchTerm.toLowerCase();

    return this.requests.filter((u) => {
      return (
        u.fullName?.toLowerCase().includes(term) ||
        u.user?.email?.toLowerCase().includes(term) ||
        u.bio?.toLowerCase().includes(term) ||
        u.status?.toLowerCase().includes(term) ||
        u.adminNote?.toLowerCase().includes(term)
      );
    });
  }
showReq(id: string) {
  if (!id) return;

  this.requestSErvice.getReqBYId(id).subscribe({
    next: (res: any) => {
      const req = res?.data; 

      if (req) {
        this.selectedReq = req;
        this.showModal = true;
      } else {
        console.warn("Request not found");
      }
    },
    error: (err) => console.error(err)
  });
}

  closeModal() {
    this.showModal = false;
    this.selectedReq = null;
  }
    deleteReq(req: any) {
    if (!confirm(`Are you want to delete request from ${req.fullName}?`)) return;
    this.requestSErvice.deleteReq(req._id).subscribe({
      next: (res) => {
        this.requests = this.requests.filter(u => u._id == req._id);
        console.log("user deleted");

        this.fetchRequests();
      },
      error: (err) => {
        console.error(err);

      }
    })
  }

  editMode = false;
  editReqData: any = {};
  selectedReqId: string = "";

openEditModal(req:any) {
  this.selectedReqId = req._id || '';
  this.editReqData = {
    fullName: req.fullName || '',
    bio: req.bio || '',
    status: req.status || '',
    adminNote: req.adminNote || '',
    idCard: req.idCard || '',
    selfie: req.selfie || '',
    user: {
      email: req.user?.email || '',
      role: req.user?.role || ''
    }
  };

  this.editMode = true;
}

  saveUserEdits() {
    this.requestSErvice.updateReq(this.selectedReqId, this.editReqData).subscribe({
      next: (res) => {
        console.log("User updated:", res);

        this.editMode = false;
        this.fetchRequests();
      },
      error: (err) => {
        console.error("Update error:", err);
      }
    });
  }


}
