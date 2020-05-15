//
//  ViewController.swift
//  speakEZ
//
//  Created by Jade on 5/12/20.
//  Copyright © 2020 Jade. All rights reserved.
//

import UIKit

class ViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
	@IBOutlet weak var chatTable: UITableView!
	@IBOutlet weak var textField: UITextField!
	@IBAction func sendButton() {
		self.mytextMessages.append(self.textField.text ?? "")
		self.textField.text = ""
		numCells += 1
		self.chatTable.reloadData()
		
		
	}
	
	var numCells = 0
	var mytextMessages = [String]()
	
	
	
	override func viewDidLoad() {
		super.viewDidLoad()
		// Do any additional setup after loading the view.
		self.chatTable.dataSource = self
		self.chatTable.delegate = self
	}
	
	func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
		return numCells
	}
	
	func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
		let cell = tableView.dequeueReusableCell(withIdentifier: "textCell") ?? UITableViewCell(style: .default, reuseIdentifier: "textCell")
		cell.textLabel?.text = ""
		cell.detailTextLabel?.text = self.mytextMessages[indexPath.row]

		cell.textLabel?.numberOfLines = 0
		return cell
	}


}

