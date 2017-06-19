import { Component, Input } from '@angular/core';

import { FeedService } from './feed.service';

@Component({
  selector: 'feed',
  templateUrl: './feed.html',
  styleUrls: ['./feed.scss']
})
export class Feed {
  @Input()
  private teamName:string;

  public feed: Array<Object>;

  constructor(private _feedService: FeedService) {
  }

  ngOnInit() {
    this._loadFeed();
    console.log(this.teamName);
  }

  expandMessage(message) {
    message.expanded = !message.expanded;
  }

  private _loadFeed() {
    this.feed = this._feedService.getData();
  }
}
