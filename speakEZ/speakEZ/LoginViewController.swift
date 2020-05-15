//
//  LoginViewController.swift
//  speakEZ
//
//  Created by Jade on 5/14/20.
//  Copyright © 2020 Jade. All rights reserved.
//

import UIKit
import PhoneNumberKit

class LoginViewController: UIViewController {
	@IBOutlet weak var numberTextField: UITextField!
	@IBOutlet weak var codeTextField: UITextField!
	@IBOutlet weak var sendButton: UIButton!
	@IBOutlet weak var errorLabel: UILabel!
	
	var tapGesture = UITapGestureRecognizer()
	var activityIndicator = UIActivityIndicatorView.init(style:.large)
	let phoneNumberKit = PhoneNumberKit()
	var phoneNumber: String = ""
	
	override func viewDidLoad() {
		initUI()
        super.viewDidLoad()
		activityIndicator.color = UIColor.black
		self.activityIndicator.center = self.view.center
		tapGesture = UITapGestureRecognizer(target: self, action: #selector(dismissKeyboard))
        self.view.addGestureRecognizer(tapGesture)
    }
    
	func initUI() {
		  errorLabel.numberOfLines = 0
		  errorLabel.isHidden = true
	  }
	  
	
	@IBAction func sendTapped(_ sender: Any) {
		let phoneNumber = numberTextField.text?.filter { $0 >= "0" && $0 <= "9" } ?? ""
        if phoneNumber.count == 0 {
            errorLabel.text = "Please enter your phone number."
            errorLabel.textColor = .red
        } else if phoneNumber.count != 10 {
            errorLabel.text = "The phone number should be 10 digits."
            errorLabel.textColor = .red
        } else {
            do {
                let parsedPhoneNumber = try phoneNumberKit.parse(numberTextField.text ?? "")
                self.phoneNumber = phoneNumberKit.format(parsedPhoneNumber, toType: .e164)
				//start the activity Indicator
				self.activityIndicator.startAnimating()
				self.view.isUserInteractionEnabled = false
				//call api
				
                dismissKeyboard()
            }
            catch {
                errorLabel.text = "Please enter a valid phone number"
                errorLabel.textColor = .red
            }
        }
        errorLabel.isHidden = false
	}
	
	@objc func dismissKeyboard() {
		   numberTextField.resignFirstResponder()
	   }
}
