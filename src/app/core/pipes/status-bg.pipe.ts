import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusBg',
  standalone: true
})
export class StatusBgPipe implements PipeTransform {

  transform(status: string): string {
    switch (status) {
      case 'new':
        return 'bg-yellow-100 text-yellow-800'; // (warn)
      case 'inProgress':
        return 'bg-blue-100 text-blue-800'; // (primary)
      case 'resolved':
        return 'bg-green-100 text-green-800'; // (success)
      case 'closed':
        return 'bg-gray-100 text-gray-800'; // (default)
      default:
        return 'bg-gray-100';
    }
  }
}
