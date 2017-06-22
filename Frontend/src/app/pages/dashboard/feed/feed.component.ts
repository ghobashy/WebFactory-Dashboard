import { Component, Input } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { FeedService } from './feed.service';

@Component({
  selector: 'feed',
  templateUrl: './feed.html',
  styleUrls: ['./feed.scss']
})
export class Feed {
  @Input()
  private teamName: string;

  public feed: Array<Object>;

  constructor(private _feedService: FeedService) {
  }

  ngOnInit() {
    this._loadFeed();

  }

  expandMessage(message) {
    message.expanded = !message.expanded;
  }

  private _loadFeed() {
    this.feed = [];
    this._feedService.getTeamMembers(this.teamName).subscribe((response: Response) => {
      let data = response.json();
      for (let resource of data) {
        this.feed.push({
          type: 'text-message',
          name: resource.name,
          jobTitle: " (" + resource.jobTitle + ")",
          email: resource.email,
          text: '',
          time: '',
          ago: '',
          level: resource.level,
          expanded: true,
          avatar: 'avatar'
        });
      }
    }, error => {
      console.log(JSON.stringify(error.json()));
    });
  }
}
